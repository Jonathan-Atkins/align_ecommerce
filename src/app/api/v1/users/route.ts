import { NextResponse } from 'next/server';

// This users API was removed per request. Return 404 to avoid exposing it.
export async function GET() {
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}
