import { NextRequest, NextResponse } from 'next/server';
import { shreyaConfig } from '@/lib/config/shreya-config';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(shreyaConfig);
  } catch (error) {
    console.error('Error fetching voice AI config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voice AI configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedConfig = await request.json();
    
    // Here you would typically update the configuration in your database
    // For now, we'll just return the updated config
    
    return NextResponse.json({
      ...shreyaConfig,
      ...updatedConfig,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating voice AI config:', error);
    return NextResponse.json(
      { error: 'Failed to update voice AI configuration' },
      { status: 500 }
    );
  }
}