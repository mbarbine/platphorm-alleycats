jest.mock('next/server', () => ({
  NextResponse: { json: (body: unknown) => ({ json: async () => body }) },
}))

import { POST } from '@/app/api/mcp/route'

function rpc(body: unknown) {
  return POST({ json: async () => body } as Request)
}

describe('Alleycats MCP JSON-RPC server', () => {
  it('lists real product tools and preserves the request id', async () => {
    const response = await rpc({ jsonrpc: '2.0', id: 'tools-1', method: 'tools/list' })
    const body = await response.json()
    expect(body.id).toBe('tools-1')
    expect(body.result.tools.map((tool: { name: string }) => tool.name)).toEqual(['get_zine_page', 'find_contributor', 'search_zine'])
  })

  it('executes a real zine search handler', async () => {
    const response = await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'search_zine', arguments: { query: 'the' } } })
    const body = await response.json()
    expect(body.id).toBe(2)
    expect(body.result.structuredContent.matches).toBeInstanceOf(Array)
  })

  it('returns a JSON-RPC method error without a stack trace', async () => {
    const response = await rpc({ jsonrpc: '2.0', id: 3, method: 'unknown/method' })
    const body = await response.json()
    expect(body).toEqual({ jsonrpc: '2.0', id: 3, error: { code: -32601, message: 'Method not found.' } })
  })
})
