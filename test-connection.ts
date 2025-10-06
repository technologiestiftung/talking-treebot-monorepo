const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.conversations.count();
  console.log('Rows in conversations table:', count);
}

main()
  .finally(() => prisma.$disconnect());
