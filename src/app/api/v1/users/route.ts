import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Try Authorization header first (Bearer token)
  const auth = req.headers.get('authorization') || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  let token: string | undefined = undefined;
  if (m) {
    token = m[1];
  } else {
    // Fallback: try cookie named 'token'
    const cookie = req.cookies.get('token');
    if (cookie) token = cookie.value;
  }
  if (!token) return NextResponse.json({ error: 'Missing Authorization' }, { status: 401 });

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) return NextResponse.json({ error: 'Server misconfiguration: JWT_SECRET not set' }, { status: 500 });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { roles?: string[] };
    const roles = payload?.roles || [];
    if (!Array.isArray(roles) || !roles.includes('owner')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json({ users });
  } catch (err: unknown) {
    // keep the error variable used to satisfy linters; don't expose details
    void err;
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
