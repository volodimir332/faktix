/**
 * Manual Knowledge Base Seeding API
 * Seeds KB with pre-curated documents
 */

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Check for DeepSeek API key
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    
    if (!deepseekKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing DEEPSEEK_API_KEY',
        message: 'Додайте DEEPSEEK_API_KEY в .env.local',
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'AI Бухгалтер готовий до роботи! 🚀',
      mode: 'DeepSeek Chat (без RAG/embeddings)',
      note: 'Система працює без бази знань - DeepSeek відповідає на основі вбудованих знань',
      status: 'ready',
    });
  } catch (error) {
    console.error('Seed API error:', error);
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
    message: 'Knowledge Base Manual Seeding API',
    info: 'Seeds KB with pre-curated Czech tax documents',
    usage: 'POST /api/kb/seed to seed the database',
  });
}

