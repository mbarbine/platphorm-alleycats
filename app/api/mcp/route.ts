import { NextResponse } from 'next/server'
import { alleycatsZine, contributors, SITE_CONFIG, tableOfContents } from '@/lib/zine-data'

export const runtime = 'edge'

type RpcRequest = { jsonrpc?: unknown; id?: unknown; method?: unknown; params?: unknown }

const tools = [
  { name: 'get_zine_page', description: 'Read one real page from the current Alleycats zine.', inputSchema: { type: 'object', properties: { pageNumber: { type: 'integer', minimum: 1 } }, required: ['pageNumber'], additionalProperties: false } },
  { name: 'find_contributor', description: 'Find a published contributor by name.', inputSchema: { type: 'object', properties: { name: { type: 'string', minLength: 1 } }, required: ['name'], additionalProperties: false } },
  { name: 'search_zine', description: 'Search published zine page titles and content.', inputSchema: { type: 'object', properties: { query: { type: 'string', minLength: 1 } }, required: ['query'], additionalProperties: false } },
]

const resources = [
  { uri: 'zine://current', name: 'Current zine', description: 'Published metadata and table of contents for the current issue.', mimeType: 'application/json' },
  { uri: 'zine://contributors', name: 'Contributors', description: 'Published contributor credits and piece lists.', mimeType: 'application/json' },
]

const prompts = [
  { name: 'navigate_zine', description: 'Help a reader find relevant published pages.', arguments: [{ name: 'interest', description: 'Reader interest or topic.', required: true }] },
  { name: 'contributor_context', description: 'Summarize a contributor using published credits only.', arguments: [{ name: 'name', description: 'Published contributor name.', required: true }] },
]

function error(id: unknown, code: number, message: string, data?: unknown) {
  return { jsonrpc: '2.0', id: id ?? null, error: { code, message, ...(data === undefined ? {} : { data }) } }
}

function result(id: unknown, value: unknown) {
  return { jsonrpc: '2.0', id: id ?? null, result: value }
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function toolCall(id: unknown, params: Record<string, unknown>) {
  const name = typeof params.name === 'string' ? params.name : ''
  const args = record(params.arguments)

  if (name === 'get_zine_page') {
    const pageNumber = Number(args.pageNumber)
    if (!Number.isInteger(pageNumber) || pageNumber < 1) return error(id, -32602, 'pageNumber must be a positive integer.')
    const page = alleycatsZine.pages.find((candidate) => candidate.pageNumber === pageNumber)
    if (!page) return error(id, -32004, 'Published zine page not found.')
    return result(id, { content: [{ type: 'text', text: JSON.stringify(page) }], structuredContent: page })
  }

  if (name === 'find_contributor') {
    const query = typeof args.name === 'string' ? args.name.trim().toLowerCase() : ''
    if (!query) return error(id, -32602, 'name is required.')
    const contributor = contributors.find((candidate) => candidate.name.toLowerCase().includes(query))
    if (!contributor) return error(id, -32004, 'Published contributor not found.')
    return result(id, { content: [{ type: 'text', text: JSON.stringify(contributor) }], structuredContent: contributor })
  }

  if (name === 'search_zine') {
    const query = typeof args.query === 'string' ? args.query.trim().toLowerCase() : ''
    if (!query) return error(id, -32602, 'query is required.')
    const matches = alleycatsZine.pages.filter((page) => page.title?.toLowerCase().includes(query) || page.content?.toLowerCase().includes(query))
    return result(id, { content: [{ type: 'text', text: JSON.stringify(matches) }], structuredContent: { matches } })
  }

  return error(id, -32601, 'Tool not found.')
}

function handle(request: RpcRequest) {
  const id = request.id
  if (request.jsonrpc !== '2.0' || typeof request.method !== 'string') return error(id, -32600, 'Invalid JSON-RPC 2.0 request.')
  const params = record(request.params)

  switch (request.method) {
    case 'initialize':
      return result(id, { protocolVersion: '2024-11-05', capabilities: { tools: {}, resources: {}, prompts: {} }, serverInfo: { name: 'alleycats-alcove-zine', version: SITE_CONFIG.version } })
    case 'ping':
      return result(id, {})
    case 'tools/list':
      return result(id, { tools })
    case 'tools/call':
      return toolCall(id, params)
    case 'resources/list':
      return result(id, { resources })
    case 'resources/read': {
      const uri = typeof params.uri === 'string' ? params.uri : ''
      if (uri === 'zine://current') return result(id, { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify({ issue: alleycatsZine.issue, title: alleycatsZine.title, theme: alleycatsZine.theme, tableOfContents }) }] })
      if (uri === 'zine://contributors') return result(id, { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(contributors) }] })
      return error(id, -32002, 'Resource not found.')
    }
    case 'prompts/list':
      return result(id, { prompts })
    case 'prompts/get': {
      const name = typeof params.name === 'string' ? params.name : ''
      const args = record(params.arguments)
      if (name === 'navigate_zine') return result(id, { description: prompts[0].description, messages: [{ role: 'user', content: { type: 'text', text: `Using published Alleycats pages only, help me find work related to: ${String(args.interest || '')}` } }] })
      if (name === 'contributor_context') return result(id, { description: prompts[1].description, messages: [{ role: 'user', content: { type: 'text', text: `Using published credits only, summarize the Alleycats contributor: ${String(args.name || '')}` } }] })
      return error(id, -32003, 'Prompt not found.')
    }
    default:
      return error(id, -32601, 'Method not found.')
  }
}

export function GET() {
  return NextResponse.json({ ok: true, data: { service: 'alleycats-alcove-zine', protocol: 'JSON-RPC 2.0', protocolVersion: '2024-11-05', endpoint: '/api/mcp', methods: ['initialize', 'ping', 'tools/list', 'tools/call', 'resources/list', 'resources/read', 'prompts/list', 'prompts/get'], tools: tools.map((tool) => tool.name), resources: resources.map((resource) => resource.uri), prompts: prompts.map((prompt) => prompt.name) } })
}

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(error(null, -32700, 'Parse error.'))
  }

  if (Array.isArray(payload)) {
    if (payload.length === 0) return NextResponse.json(error(null, -32600, 'Invalid empty batch.'))
    return NextResponse.json(payload.map((entry) => handle(record(entry) as RpcRequest)))
  }
  return NextResponse.json(handle(record(payload) as RpcRequest))
}
