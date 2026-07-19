jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      json: async () => data,
    }),
  },
}))

import { GET } from '@/app/api/v1/health/route'

describe('GET /api/v1/health', () => {
  it('wraps the real health payload in the platform REST envelope', async () => {
    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toMatchObject({
      ok: true,
      data: {
        status: 'healthy',
        service: 'alleycats-alcove-zine',
      },
    })
    expect(body.data.currentIssue.pageCount).toBeGreaterThan(0)
  })
})
