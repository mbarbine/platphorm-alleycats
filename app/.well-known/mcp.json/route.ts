export function GET() {
  return Response.json({ jsonrpc: '2.0', protocolVersion: '2024-11-05', service: 'alleycats-alcove-zine', endpoint: 'https://alleycats.platphormnews.com/api/mcp', transport: 'http', methods: ['initialize', 'ping', 'tools/list', 'tools/call', 'resources/list', 'resources/read', 'prompts/list', 'prompts/get'] })
}
