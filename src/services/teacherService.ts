import prisma from "prisma/client";

/**
 * Check if the teacher already exists
 * @param teacherEmail
 * @returns
 */
export const checkIfTeacherExists = async (
  teacherEmail: string
): Promise<boolean> => {
  const teacherData = await prisma.teacher.findFirst({
    where: {
      email: teacherEmail,
    },
  });

  return !!teacherData;
};

/**
 * Check if the Student already registered
 * @param studentEmails
 * @returns
 */
export const checkIfStudentsExists = async (
  studentEmails: string[]
): Promise<boolean> => {
  const existingStudents = await prisma.student.findMany({
    where: {
      email: { in: studentEmails },
    },
    select: {
      email: true,
    },
  });

  //   return existingStudents.map((stdt: any) => stdt.email);
  return existingStudents.length > 0;
};

export const getTeacherDetailsByTeacherEmails = async (
  teacherEmails: string[]
) => {
  return await prisma.teacher.findMany({
    where: {
      email: {
        in: teacherEmails,
      },
      isActive: true,
    },
    // select: { id: true, email: true },
  });
};

export const getStudentsByTeacherEmails = async (
  teacherEmails: string[]
): Promise<string[]> => {
  console.log("teacherEmails >> ", teacherEmails);
  const students = await prisma.student.findMany({
    where: {
      teacher: {
        email: { in: teacherEmails },
      },
    },
    include: {
      teacher: {
        select: { id: true, email: true },
      },
    },
  });

  console.log("students: ", students);
  return students.map((student: any) => student.email);
};
