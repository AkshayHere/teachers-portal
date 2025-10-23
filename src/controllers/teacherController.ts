import { Request, Response } from "express";
import prisma from "prisma/client";
import {
  createTeacherSchema,
  getCommonStudentsQuerySchema,
} from "schemas/teacherSchema";
import {
  HTTP_CODE_DUPLICATE_RECORD,
  HTTP_CODE_SERVER_ERROR,
  HTTP_CODE_SUCCESS,
  HTTP_CODE_SUCCESS_NO_CONTENT,
  SERVER_ERROR,
  ZOD_DUPLICATE_RECORD_CODE,
} from "src/constants/generalConstants";
import {
  checkIfStudentsExists,
  checkIfTeacherExists,
  getStudentsByTeacherEmails,
} from "src/services/teacherService";

export const getTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await prisma.teacher.findMany();
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: SERVER_ERROR });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  const parseResult = createTeacherSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parseResult.error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }

  const { teacher, students } = parseResult.data;
  console.log("teacher: ", teacher);
  console.log("students: ", students);

  // Check if teacher exists, before we insert
  const isTeacherExists = await checkIfTeacherExists(teacher);
  if (isTeacherExists) {
    res
      .status(HTTP_CODE_DUPLICATE_RECORD)
      .json({ error: "Teacher email already exists." });
  }

  const isStudentsExists = await checkIfStudentsExists(students);
  if (isStudentsExists) {
    res
      .status(HTTP_CODE_DUPLICATE_RECORD)
      .json({ error: "Student email already exists." });
  }

  const studentsDetails = students.map((student) => {
    return {
      email: student,
    };
  });
  console.log("studentsDetails: ", studentsDetails);

  try {
    const teacherData = await prisma.teacher.create({
      data: {
        email: teacher,
        students: {
          create: studentsDetails,
        },
      },
    });
    console.log("teacherData: ", teacherData);
    res.status(HTTP_CODE_SUCCESS).json(teacherData);
  } catch (error: any) {
    if (error.code === ZOD_DUPLICATE_RECORD_CODE) {
      console.error("error > ", error);
    }
    res.status(HTTP_CODE_SERVER_ERROR).json({ error: SERVER_ERROR });
  }
};

export const getCommonStudents = async (req: Request, res: Response) => {
  const parseResult = getCommonStudentsQuerySchema.parse(req.query);
  const teacherEmails = parseResult.teacher;
  console.log("teacherEmails: ", teacherEmails);

  try {
    const studentDetails = await getStudentsByTeacherEmails(teacherEmails);
    console.log("studentDetails: ", studentDetails);
    res.json({ students: studentDetails });
  } catch (error: any) {
    console.error("error > ", error);
    res.status(HTTP_CODE_SERVER_ERROR).json({ error: SERVER_ERROR });
  }
};
