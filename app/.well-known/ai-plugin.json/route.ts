import { NextResponse } from 'next/server'

const AI_PLUGIN = {
  schema_version: 'v1',
  name_for_human: 'Alleycats Alcove Zine',
  name_for_model: 'alleycats_zine',
  description_for_human: 'Read and explore Issue #1 of Alleycats Alcove, a collaborative zine from Front Royal, VA featuring poetry and creative writing.',
  description_for_model: 'Access the Alleycats Alcove Zine content including the table of contents, individual pages, contributor information, and metadata. The current issue theme is "A Letter to A Substance" and features 8 pieces by local Shenandoah Valley artists. Use this plugin to retrieve zine content, search for specific pieces, or get information about contributors and upcoming issues.',
  auth: {
    type: 'none',
  },
  api: {
    type: 'openapi',
    url: 'https://alleycats.platphormnews.com/api/docs',
  },
  logo_url: 'https://alleycats.platphormnews.com/icon-512x512.jpg',
  contact_email: 'hello@platphormnews.com',
  legal_info_url: 'https://alleycats.platphormnews.com/privacy',
}

export async function GET() {
  return NextResponse.json(AI_PLUGIN, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
