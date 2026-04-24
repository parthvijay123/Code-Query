import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with CP questions...');

  // 1. Create a dummy user
  const user = await prisma.user.upsert({
    where: { email: 'junior@example.com' },
    update: {},
    create: {
      name: 'Junior Coder',
      email: 'junior@example.com',
      password: 'dummy_password_hash',
      reputation: 15,
    },
  });

  console.log(`Created user: ${user.name}`);

  // 2. Add some competitive programming questions
  const questions = [
    {
      title: 'How to optimize finding prime numbers up to 10^7?',
      content: 'I am trying to solve a problem on Codeforces that requires checking prime numbers up to 10^7. I used a simple `for` loop but it gives Time Limit Exceeded (TLE). \n\nI heard about the Sieve of Eratosthenes, but how do I implement it efficiently in C++ without using too much memory? Any code snippets would be helpful!',
      tags: 'c++,math,number-theory,optimization',
      authorId: user.id,
    },
    {
      title: 'Segment Tree vs Fenwick Tree (BIT): When to use which?',
      content: 'I recently learned about Range Query data structures. Both Segment Trees and Fenwick Trees seem to do point updates and range sum queries in O(log N). \n\nFenwick tree code is much shorter, but I see top competitive programmers using Segment Trees very often. What are the specific scenarios where a Segment Tree is absolutely necessary over a Fenwick Tree?',
      tags: 'data-structures,trees,range-queries,competitive-programming',
      authorId: user.id,
    },
    {
      title: 'Why is my BFS getting Memory Limit Exceeded on a grid?',
      content: 'I have a 2D grid of size 1000x1000 and I am running a standard Breadth-First Search (BFS) to find the shortest path. \n\nFor some reason, I am getting Memory Limit Exceeded (MLE) on the judge. I am pushing states `(r, c)` into a `std::queue<pair<int, int>>`. Is the queue taking too much memory? How can I fix this?',
      tags: 'graphs,bfs,c++,memory-limit',
      authorId: user.id,
    }
  ];

  for (const q of questions) {
    const created = await prisma.question.create({
      data: q
    });
    console.log(`Created question: ${created.title}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
