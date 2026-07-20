import { NextResponse, type NextRequest } from "next/server"

const TRACEPARENT_RE = /^([0-9a-f]{2})-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/i
const TRACE_ID_RE = /^[0-9a-f]{32}$/i
const SPAN_ID_RE = /^[0-9a-f]{16}$/i
const CONTROL_RE = /[\u0000-\u001f\u007f]/
const BAGGAGE_ALLOWLIST = new Set([
  "platphorm.workflow_run_id",
  "platphorm.test_run_id",
  "platphorm.agent_run_id",
  "platphorm.session_id",
])

export interface PlatphormTraceContext {
  traceId: string
  spanId: string
  parentSpanId?: string
  requestId: string
  traceparent: string
  tracestate?: string
  baggage?: string
  sourceSite: string
  targetSite: string
  acceptedIncomingTrace: boolean
}

function safeHeaderValue(value: string | null | undefined, maxLength = 512) {
  if (!value) return undefined
  const trimmed = value.trim()
  return trimmed && trimmed.length <= maxLength && !CONTROL_RE.test(trimmed) ? trimmed : undefined
}

function randomHex(bytes: number) {
  const data = new Uint8Array(bytes)
  globalThis.crypto.getRandomValues(data)
  let value = Array.from(data, (byte) => byte.toString(16).padStart(2, "0")).join("")
  if (/^0+$/.test(value)) value = `1${value.slice(1)}`
  return value
}

function parseTraceparent(value: string | null | undefined) {
  const match = safeHeaderValue(value, 128)?.match(TRACEPARENT_RE)
  if (!match || /^0+$/.test(match[2]) || /^0+$/.test(match[3])) return null
  return {
    traceId: match[2].toLowerCase(),
    spanId: match[3].toLowerCase(),
    flags: match[4].toLowerCase(),
  }
}

function sanitizeTracestate(value: string | null | undefined) {
  const header = safeHeaderValue(value)
  if (!header) return undefined
  const entries = header
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 32)
    .filter((entry) => /^[a-z0-9_\-*/@]{1,256}=[\x20-\x7e]{1,256}$/i.test(entry))
    .filter((entry) => !/(key|token|secret|auth|cookie|password)/i.test(entry))
  return entries.length ? entries.join(",") : undefined
}

function sanitizeBaggage(value: string | null | undefined) {
  const header = safeHeaderValue(value)
  if (!header) return undefined
  const entries = header
    .split(",")
    .map((entry) => entry.trim())
    .flatMap((entry) => {
      const separator = entry.indexOf("=")
      if (separator <= 0) return []
      const key = entry.slice(0, separator).trim().toLowerCase()
      const entryValue = entry.slice(separator + 1).split(";")[0]?.trim() || ""
      return BAGGAGE_ALLOWLIST.has(key) && /^[A-Za-z0-9._~:%-]{1,128}$/.test(entryValue)
        ? [`${key}=${entryValue}`]
        : []
    })
    .slice(0, 8)
  return entries.length ? entries.join(",") : undefined
}

function mergeHeaderList(existing: string | null, additions: string[]) {
  const values = new Map<string, string>()
  for (const value of [...(existing?.split(",") || []), ...additions]) {
    const trimmed = value.trim()
    if (trimmed) values.set(trimmed.toLowerCase(), trimmed)
  }
  return [...values.values()].join(", ")
}

export function createPlatphormTraceContext(headers: Headers): PlatphormTraceContext {
  const incoming = parseTraceparent(headers.get("traceparent"))
  const fallbackTraceId = safeHeaderValue(headers.get("x-platphorm-trace-id"), 32)
  const fallbackSpanId = safeHeaderValue(headers.get("x-platphorm-span-id"), 16)
  const traceId = incoming?.traceId ?? (
    fallbackTraceId && TRACE_ID_RE.test(fallbackTraceId) && !/^0+$/.test(fallbackTraceId)
      ? fallbackTraceId.toLowerCase()
      : randomHex(16)
  )
  const spanId = randomHex(8)
  const parentSpanId = incoming?.spanId ?? (
    fallbackSpanId && SPAN_ID_RE.test(fallbackSpanId) && !/^0+$/.test(fallbackSpanId)
      ? fallbackSpanId.toLowerCase()
      : undefined
  )
  const targetSite = safeHeaderValue(headers.get("x-forwarded-host"), 255)
    ?? safeHeaderValue(headers.get("host"), 255)
    ?? "unknown.platphormnews.com"

  return {
    traceId,
    spanId,
    parentSpanId,
    requestId: safeHeaderValue(headers.get("x-platphorm-request-id"), 128) ?? globalThis.crypto.randomUUID(),
    traceparent: `00-${traceId}-${spanId}-${incoming?.flags ?? "01"}`,
    tracestate: sanitizeTracestate(headers.get("tracestate")),
    baggage: sanitizeBaggage(headers.get("baggage")),
    sourceSite: safeHeaderValue(headers.get("x-platphorm-source-site"), 255) ?? "external",
    targetSite,
    acceptedIncomingTrace: Boolean(incoming),
  }
}

export function applyPlatphormTraceHeaders(headers: Headers, context: PlatphormTraceContext) {
  headers.set("traceparent", context.traceparent)
  if (context.tracestate) headers.set("tracestate", context.tracestate)
  if (context.baggage) headers.set("baggage", context.baggage)
  headers.set("X-PlatPhorm-Trace-Id", context.traceId)
  headers.set("X-PlatPhorm-Span-Id", context.spanId)
  if (context.parentSpanId) headers.set("X-PlatPhorm-Parent-Span-Id", context.parentSpanId)
  headers.set("X-PlatPhorm-Request-Id", context.requestId)
  headers.set("X-PlatPhorm-Source-Site", context.sourceSite)
  headers.set("X-PlatPhorm-Target-Site", context.targetSite)
}

export function withPlatphormTrace(request: NextRequest, providedResponse?: Response | null | void) {
  const context = createPlatphormTraceContext(request.headers)
  const response = providedResponse ?? (() => {
    const requestHeaders = new Headers(request.headers)
    applyPlatphormTraceHeaders(requestHeaders, context)
    return NextResponse.next({ request: { headers: requestHeaders } })
  })()

  applyPlatphormTraceHeaders(response.headers, context)
  response.headers.set(
    "Access-Control-Expose-Headers",
    mergeHeaderList(response.headers.get("Access-Control-Expose-Headers"), [
      "traceparent",
      "tracestate",
      "X-PlatPhorm-Trace-Id",
      "X-PlatPhorm-Span-Id",
      "X-PlatPhorm-Parent-Span-Id",
      "X-PlatPhorm-Request-Id",
      "X-PlatPhorm-Source-Site",
      "X-PlatPhorm-Target-Site",
    ]),
  )
  if (response.headers.has("Access-Control-Allow-Headers")) {
    response.headers.set(
      "Access-Control-Allow-Headers",
      mergeHeaderList(response.headers.get("Access-Control-Allow-Headers"), [
        "traceparent",
        "tracestate",
        "baggage",
        "X-PlatPhorm-Trace-Id",
        "X-PlatPhorm-Span-Id",
        "X-PlatPhorm-Parent-Span-Id",
        "X-PlatPhorm-Request-Id",
        "X-PlatPhorm-Source-Site",
        "X-PlatPhorm-Target-Site",
      ]),
    )
  }
  return response
}
