import { NextRequest, NextResponse } from 'next/server'
import { alleycatsZine } from '@/lib/zine-data'
import { NETWORK_CONFIG } from '@/lib/platphorm-network'

// Proxy to ASCII converter for zine pages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageNumber, resolution, charset, inverted } = body
    
    // Validate page number
    if (!pageNumber || pageNumber < 1 || pageNumber > alleycatsZine.pages.length) {
      return NextResponse.json(
        { error: `Invalid page number. Valid range: 1-${alleycatsZine.pages.length}` },
        { status: 400 }
      )
    }
    
    const page = alleycatsZine.pages.find(p => p.number === pageNumber)
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    
    // Fetch the image and convert to base64
    const imageUrl = `https://alleycats.platphormnews.com${page.image}`
    const imageResponse = await fetch(imageUrl)
    
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch page image' },
        { status: 500 }
      )
    }
    
    const imageBuffer = await imageResponse.arrayBuffer()
    const base64 = Buffer.from(imageBuffer).toString('base64')
    const dataUri = `data:image/jpeg;base64,${base64}`
    
    // Call ASCII converter
    const asciiResponse = await fetch(NETWORK_CONFIG.integrations.asciiConvert, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: dataUri,
        resolution: resolution ?? 0.11,
        charset: charset ?? 'standard',
        grayscale: true,
        inverted: inverted ?? false,
      }),
    })
    
    if (!asciiResponse.ok) {
      return NextResponse.json(
        { error: 'ASCII conversion failed' },
        { status: 502 }
      )
    }
    
    const asciiResult = await asciiResponse.json()
    
    return NextResponse.json({
      page: {
        number: page.number,
        type: page.type,
        title: page.title,
      },
      ascii: asciiResult.ascii,
      dimensions: {
        width: asciiResult.width,
        height: asciiResult.height,
      },
      options: {
        resolution: resolution ?? 0.11,
        charset: charset ?? 'standard',
        inverted: inverted ?? false,
      },
      source: NETWORK_CONFIG.siblings.ascii.domain,
    })
  } catch (error) {
    console.error('ASCII conversion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'ASCII Art Integration',
    description: 'Convert zine pages to ASCII art via ascii.platphormnews.com',
    usage: {
      method: 'POST',
      body: {
        pageNumber: 'number (1-10)',
        resolution: 'number (0.05-0.3, default: 0.11)',
        charset: 'string (standard|detailed|blocks|minimal|binary|matrix)',
        inverted: 'boolean (default: false)',
      },
    },
    network: NETWORK_CONFIG.siblings.ascii,
  })
}
