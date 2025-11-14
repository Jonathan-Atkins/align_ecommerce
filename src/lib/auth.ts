import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export type SimpleUser = { id: string; email: string; name?: string | null } | null;

/**
 * Check credentials against the database. Returns a minimal user object on success, or null on failure.
 * This keeps auth logic in one place so multiple routes can reuse it.
 */
export async function authCheck(email: string, password: string): Promise<SimpleUser> {
  if (!email || !password) return null;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  return { id: user.id, email: user.email, name: user.name };
}
