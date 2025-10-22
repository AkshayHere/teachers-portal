import { PrismaClient } from "@prisma/client";
const Chance = require('chance');

const prisma = new PrismaClient();
const chance = new Chance();

async function main() {
  console.log("Seeding database...");

   const users = Array.from({ length: 10 }).map(() => ({
    name: chance.name(),
    email: chance.email(),
  }));

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true, // skip duplicates by unique constraint like email
  });

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
