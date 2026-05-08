import { NextResponse } from 'next/server'
import { NETWORK_CONFIG } from '@/lib/platphorm-network'
import { alleycatsZine, tableOfContents } from '@/lib/zine-data'

const baseUrl = 'https://alleycats.platphormnews.com'

export async function GET() {
  const openApiSpec = {
    openapi: '3.1.0',
    info: {
      title: 'Alleycats Alcove Zine API',
      description: `Interactive digital zine reader API supporting local artists. Part of the PlatPhorm News Network (${NETWORK_CONFIG.stats.totalSites}+ sites, MCP-powered, AI-ready). Central MCP Hub at ${NETWORK_CONFIG.mcpHub}.`,
      version: '1.0.0',
      contact: {
        name: 'Alleycats Alcove',
        url: baseUrl,
        email: 'zine@platphormnews.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      'x-network': {
        name: NETWORK_CONFIG.name,
        mcpHub: NETWORK_CONFIG.mcpHub,
        thisSite: NETWORK_CONFIG.thisSite,
      },
    },
    servers: [
      { url: baseUrl, description: 'Production' },
      { url: 'http://localhost:3000', description: 'Development' },
    ],
    tags: [
      { name: 'Zine', description: 'Zine content and metadata' },
      { name: 'Contributors', description: 'Artist and author information' },
      { name: 'Network', description: 'Platphorm News Network integration' },
      { name: 'Health', description: 'Service health and monitoring' },
      { name: 'MCP', description: 'Model Context Protocol tools' },
      { name: 'Discovery', description: 'LLM and AI discovery endpoints' },
    ],
    paths: {
      '/api/health': {
        get: {
          operationId: 'getHealth',
          tags: ['Health'],
          summary: 'Health check',
          description: 'Check API health, dependencies, and roadmap status',
          responses: {
            '200': {
              description: 'Service health status',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/HealthResponse' },
                },
              },
            },
          },
        },
      },
      '/api/v1/zine': {
        get: {
          operationId: 'getZine',
          tags: ['Zine'],
          summary: 'Get current zine',
          description: 'Returns full zine metadata, table of contents, and page information',
          responses: {
            '200': {
              description: 'Zine data',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ZineResponse' },
                },
              },
            },
          },
        },
      },
      '/api/v1/zine/pages/{pageNumber}': {
        get: {
          operationId: 'getZinePage',
          tags: ['Zine'],
          summary: 'Get specific page',
          description: 'Returns data for a specific zine page',
          parameters: [
            {
              name: 'pageNumber',
              in: 'path',
              required: true,
              schema: { type: 'integer', minimum: 1, maximum: alleycatsZine.pages.length },
            },
          ],
          responses: {
            '200': {
              description: 'Page data',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ZinePage' },
                },
              },
            },
            '404': {
              description: 'Page not found',
            },
          },
        },
      },
      '/api/v1/contributors': {
        get: {
          operationId: 'getContributors',
          tags: ['Contributors'],
          summary: 'List all contributors',
          description: 'Returns all artists, authors, and editors who contributed to the zine',
          responses: {
            '200': {
              description: 'Contributors list',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ContributorsResponse' },
                },
              },
            },
          },
        },
      },
      '/api/mcp': {
        get: {
          operationId: 'getMcpInfo',
          tags: ['MCP'],
          summary: 'MCP server info',
          description: 'Model Context Protocol server capabilities and tools',
          responses: {
            '200': {
              description: 'MCP server info',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/McpInfo' },
                },
              },
            },
          },
        },
        post: {
          operationId: 'mcpCall',
          tags: ['MCP'],
          summary: 'Call MCP tool',
          description: 'Execute an MCP tool with provided arguments',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/McpRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Tool result',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/McpResponse' },
                },
              },
            },
          },
        },
      },
      '/llms.txt': {
        get: {
          operationId: 'getLlmsTxt',
          tags: ['Discovery'],
          summary: 'LLM discovery file',
          description: 'Machine-readable description of the site for AI assistants',
          responses: {
            '200': {
              description: 'LLM discovery content',
              content: {
                'text/plain': {
                  schema: { type: 'string' },
                },
              },
            },
          },
        },
      },
      '/llms-full.txt': {
        get: {
          operationId: 'getLlmsFullTxt',
          tags: ['Discovery'],
          summary: 'Full LLM discovery',
          description: 'Extended machine-readable description with all content',
          responses: {
            '200': {
              description: 'Full LLM discovery content',
              content: {
                'text/plain': {
                  schema: { type: 'string' },
                },
              },
            },
          },
        },
      },
      '/feed.xml': {
        get: {
          operationId: 'getRssFeed',
          tags: ['Discovery'],
          summary: 'RSS feed',
          description: 'RSS 2.0 feed of zine issues',
          responses: {
            '200': {
              description: 'RSS feed',
              content: {
                'application/rss+xml': {
                  schema: { type: 'string' },
                },
              },
            },
          },
        },
      },
      '/sitemap.xml': {
        get: {
          operationId: 'getSitemap',
          tags: ['Discovery'],
          summary: 'XML Sitemap',
          description: 'Sitemap with multilingual alternates',
          responses: {
            '200': {
              description: 'Sitemap XML',
              content: {
                'application/xml': {
                  schema: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        HealthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok', 'degraded', 'error'] },
            version: { type: 'string' },
            uptime: { type: 'number' },
            timestamp: { type: 'string', format: 'date-time' },
            checks: { type: 'object' },
            roadmap: { type: 'object' },
          },
        },
        ZineResponse: {
          type: 'object',
          properties: {
            zine: { $ref: '#/components/schemas/ZineMetadata' },
            tableOfContents: {
              type: 'array',
              items: { $ref: '#/components/schemas/TocEntry' },
            },
            totalPages: { type: 'integer' },
          },
        },
        ZineMetadata: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            subtitle: { type: 'string' },
            issue: { type: 'integer' },
            date: { type: 'string' },
            theme: { type: 'string' },
            location: { type: 'string' },
          },
        },
        ZinePage: {
          type: 'object',
          properties: {
            number: { type: 'integer' },
            type: { type: 'string' },
            image: { type: 'string' },
            title: { type: 'string' },
            author: { type: 'string' },
            content: { type: 'string' },
          },
        },
        TocEntry: {
          type: 'object',
          properties: {
            number: { type: 'integer' },
            title: { type: 'string' },
            author: { type: 'string' },
            page: { type: 'integer' },
          },
        },
        ContributorsResponse: {
          type: 'object',
          properties: {
            contributors: {
              type: 'array',
              items: { $ref: '#/components/schemas/Contributor' },
            },
            issue: { type: 'integer' },
            date: { type: 'string' },
          },
        },
        Contributor: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            handle: { type: 'string' },
            role: { type: 'string' },
            works: { type: 'array', items: { type: 'string' } },
          },
        },
        McpInfo: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            version: { type: 'string' },
            tools: { type: 'array', items: { $ref: '#/components/schemas/McpTool' } },
            resources: { type: 'array', items: { type: 'object' } },
          },
        },
        McpTool: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            inputSchema: { type: 'object' },
          },
        },
        McpRequest: {
          type: 'object',
          required: ['method', 'params'],
          properties: {
            jsonrpc: { type: 'string', default: '2.0' },
            id: { type: 'string' },
            method: { type: 'string' },
            params: { type: 'object' },
          },
        },
        McpResponse: {
          type: 'object',
          properties: {
            jsonrpc: { type: 'string' },
            id: { type: 'string' },
            result: { type: 'object' },
            error: { type: 'object' },
          },
        },
      },
    },
    'x-network-integrations': {
      ascii: {
        description: 'Convert zine pages to ASCII art',
        endpoint: NETWORK_CONFIG.integrations.asciiConvert,
        method: 'POST',
      },
      translate: {
        description: 'Translate zine content',
        endpoint: NETWORK_CONFIG.integrations.translate,
        method: 'POST',
      },
      claws: {
        description: 'Security intelligence',
        endpoint: NETWORK_CONFIG.integrations.clawsThreats,
        method: 'GET',
      },
      networkGraph: {
        description: 'Network topology',
        endpoint: NETWORK_CONFIG.integrations.networkGraph,
        method: 'GET',
      },
    },
  }

  return NextResponse.json(openApiSpec, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'X-Network': 'platphormnews',
      'X-MCP-Enabled': 'true',
    },
  })
}
