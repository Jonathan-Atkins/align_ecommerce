import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const admins = [
    { email: 'josh@alignecommerce.com', password: 'bigrIh-pipmux-7pyncu', name: 'Josh' },
    { email: 'joanthanatkins.dev@gmail.com', password: 'LasVegas12!', name: 'Jonathan' }
  ];

  for (const a of admins) {
    const hashed = await bcrypt.hash(a.password, salt);
    await prisma.user.upsert({
      where: { email: a.email },
      update: { password: hashed, name: a.name },
      create: { email: a.email, password: hashed, name: a.name }
    });
  }
  console.log('Seed complete');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
