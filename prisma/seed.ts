require('dotenv').config();
import { PrismaClient } from '@prisma/client'

console.log('Seed script is starting...');
console.log('DATABASE_URL in seed:', process.env.DATABASE_URL);
const prisma = new PrismaClient()

async function main() {
  await prisma.conversations.createMany({
    data: [
      {
        datetime: new Date(),
        answers: ['Answer 1', 'Answer 2', 'Answer 3'],
        questions: ['Question 1', 'Question 2', 'Question 3'],
        language: 'en',
        topic: 'technology',
      },
      {
        datetime: new Date(Date.now() - 1000 * 60 * 60),
        answers: ['Yes', 'No', 'Maybe'],
        questions: ['Is it working?', 'Is it fast?', 'Is it reliable?'],
        language: 'de',
        topic: 'business',
      },
      {
        datetime: new Date(Date.now() - 1000 * 60 * 60 * 4),
        answers: ['I dunno', 'Yes, definetely', 'Maybe'],
        questions: ['Is it green?', 'Is it cool?', 'Is it healthy?'],
        language: 'de',
        topic: 'environment',
      },
    ],
    skipDuplicates: true, // optional
  })

  console.log('Seeded 3 conversations!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
