/**
 * Knowledge Base Scraper API
 * Endpoint to trigger KB data collection
 */

import { NextRequest, NextResponse } from 'next/server';
import { scrapeAllSources, scrapeSingleSource } from '@/lib/kb/scraper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, action } = body;
    
    // TODO: Implement actual scraping when ready
    
    return NextResponse.json({
      success: true,
      message: 'Scraper endpoint is ready (mock mode)',
      action,
      source,
      note: 'Full scraping will be implemented in Phase 2 with Puppeteer',
      recommendation: 'Use npm run kb:seed for quick start with manual documents',
    });
  } catch (error) {
    console.error('Scraper API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Knowledge Base Scraper API',
    version: '1.0.0',
    endpoints: {
      scrapeAll: 'POST /api/kb/scrape { action: "scrape_all" }',
      scrapeSingle: 'POST /api/kb/scrape { action: "scrape_single", source: "source_key" }',
    },
    availableSources: [
      'financni_sprava',
      'cssz',
      'mfcr',
      'e_sbirka',
    ],
  });
}

