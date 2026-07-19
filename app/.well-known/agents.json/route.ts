export function GET() {
  return Response.json({ ok: true, data: { service: 'alleycats-alcove-zine', purpose: 'Collaborative local-artist zine discovery and reading.', publicReadOnly: true, protectedActionsRequire: 'PLATPHORM_API_KEY', instructions: ['Preserve contributor attribution.', 'Treat published zine pages as the source of truth.', 'Do not invent submissions or contributor activity.'] } })
}
