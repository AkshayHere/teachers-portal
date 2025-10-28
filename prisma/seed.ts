import { PrismaClient } from "@prisma/client";
import Chance from "chance";
// const Chance = require("chance");

const prisma = new PrismaClient();
const chance = new Chance();

async function main() {
  console.log("Seeding database...");
  // Create sample teachers
  const teachers = Array.from({ length: 10 }).map(() => ({
    email: chance.email(),
  }));

  await prisma.teacher.createMany({
    data: teachers,
    skipDuplicates: true,
  });

  // Create sample students
  const students = Array.from({ length: 10 }).map(() => ({
    email: chance.email(),
  }));

  for (let index = 0; index < students.length; index++) {
    const studentDetails = students[index];
    const teacherId = chance.integer({ min: 0, max: 9 });
    const teacherEmail = teachers[teacherId].email;
    await prisma.student.create({
      data: {
        email: studentDetails.email,
        teachers: {
          connect: [{ email: teacherEmail }],
        },
      },
    });
  }
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
