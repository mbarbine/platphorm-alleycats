const policy = 'Web dashboard, public-safe discovery, browser-based operations, trusted-domain discovery, standard route compliance, Vercel metadata capture, trace inspection, and agentic workflow discovery are intentionally supported for public read-only debugging and operator workflows. Mutating, administrative, ingestion, replay, fork, remediation, deployment, sync, test-triggering, reporting, and write actions require PLATPHORM_API_KEY.'

export function GET() {
  return Response.json({ ok: true, data: { service: 'alleycats-alcove-zine', trustedDomains: ['*.platphormnews.com'], publicReadOnly: true, protectedActionsRequire: 'PLATPHORM_API_KEY', dataExposure: 'Published zine pages and contributor credits only.', policy } })
}
