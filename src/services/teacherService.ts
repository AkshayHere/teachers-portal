import prisma from "prisma/client";
import { IStudent } from "src/modals/teacher";

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

  return existingStudents.length > 0;
};

export const checkIfStudentEmailExists = async (
  studentEmail: string
): Promise<boolean> => {
  const existingStudent = await prisma.student.findMany({
    where: {
      email: studentEmail,
    },
    select: {
      email: true,
    },
  });

  return existingStudent.length > 0;
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
  const students = await prisma.student.findMany({
    where: {
      teachers: {
        some: {
          email: { in: teacherEmails },
        },
      },
      isSuspended: false,
    },
    include: {
      teachers: {
        select: { id: true, email: true },
      },
    },
  });

  // console.log("students: ", students);
  return students.map((student: IStudent) => student.email);
};

export const getValidStudentsByEmails = async (
  studentEmails: string[]
): Promise<string[]> => {
  const students = await prisma.student.findMany({
    where: {
      email: { in: studentEmails },
      isSuspended: false,
    },
  });

  // console.log("students: ", students);
  return students.map((student: IStudent) => student.email);
};

export const checkIfStudentsActive = async (
  studentEmail: string
): Promise<boolean> => {
  const students = await prisma.student.findFirst({
    where: {
      email: studentEmail,
      isSuspended: false,
    },
  });

  return Boolean(students);
};

export const suspendStudent = async (
  studentEmail: string
): Promise<boolean> => {
  const isExists = checkIfStudentsActive(studentEmail);
  if (!isExists) {
    return false;
  }

  await prisma.student.update({
    where: { email: studentEmail },
    data: {
      isSuspended: true,
      teachers: {
        set: [],
      },
    },
  });
  return true;
};

export const extractEmailsFromNotification = (text: string): string[] => {
  const matches = text.match(
    /@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
  );
  if (!matches) return [];
  return matches.map((m) => m.slice(1).toLowerCase());
};
