/**
 * Knowledge Base Statistics API
 * Get current KB status and statistics
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock stats for now
    const stats = {
      totalDocuments: 0,
      totalChunks: 0,
      documentsBySource: {},
      documentsByCategory: {},
      message: '⚠️ KB not initialized. Run: npm run kb:seed',
    };
    
    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('KB Stats API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

