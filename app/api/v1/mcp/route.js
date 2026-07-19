export async function GET() {
  const mcpConfig = {
    mcpVersion: '1.0',
    server: {
      name: '-alleycats MCP Server',
      url: 'https://-alleycats.platphormnews.com/api/v1/mcp'
    },
    tools: [
      { name: 'getHealth', description: 'Health check for this service.' }
    ],
    resources: {
      graph: 'https://platphormnews.com/api/network/graph'
    }
  };

  return new Response(JSON.stringify(mcpConfig), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
