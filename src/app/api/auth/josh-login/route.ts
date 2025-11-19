import { NextRequest, NextResponse } from 'next/server';
import { authCheck } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
  // Simple slug endpoint that redirects the owner to the login page.
  // Route: /api/auth/josh-login
  const base = new URL(req.url).origin;
  return NextResponse.redirect(`${base}/auth`);
}

// Allow POST to this slug to authenticate directly using same auth logic.
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }
  const user = await authCheck(email, password);
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  // On successful auth, redirect the browser to a blank success page.
  const base = new URL(req.url).origin;
  return NextResponse.redirect(`${base}/auth/josh-success`);
}
