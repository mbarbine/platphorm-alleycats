const document = `openapi: 3.1.0
info:
  title: Alleycats Alcove Zine API
  version: 0.1.0
  description: Public read-only access to the collaborative zine, its pages, and contributors.
servers:
  - url: https://alleycats.platphormnews.com
paths:
  /api/health:
    get:
      summary: Read service health
      responses:
        '200': { description: Current zine and service status }
  /api/v1/zine:
    get:
      summary: Read the current zine
      responses:
        '200': { description: Current zine data }
  /api/v1/contributors:
    get:
      summary: List real zine contributors
      responses:
        '200': { description: Contributor list }
`

export function GET() {
  return new Response(document, { headers: { 'Content-Type': 'application/yaml; charset=utf-8' } })
}
