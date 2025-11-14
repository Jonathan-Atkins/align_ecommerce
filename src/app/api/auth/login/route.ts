import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: { include: { role: true } } },
  });

  if (!user || !user.password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return NextResponse.json({ error: 'Server misconfiguration: JWT_SECRET not set' }, { status: 500 });
  }

  const roles = (user.roles || []).map(r => r.role?.name).filter(Boolean);

  const token = jwt.sign({ sub: user.id, email: user.email, roles }, JWT_SECRET, { expiresIn: '1h' });

  // Set token as a secure HttpOnly cookie. For local development without HTTPS,
  // omit Secure so the cookie can be set on localhost. In production, Secure=true.
  const secure = process.env.NODE_ENV === 'production';
  const maxAge = 60 * 60; // 1 hour in seconds
  const cookie = `token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${
    secure ? '; Secure' : ''
  }`;

  const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  res.headers.set('Set-Cookie', cookie);
  return res;
}
