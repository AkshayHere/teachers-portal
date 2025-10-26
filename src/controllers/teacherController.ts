import { Request, Response } from "express";
import prisma from "prisma/client";
import {
  createTeacherSchema,
  getCommonStudentsQuerySchema,
  suspendStudentSchema,
  teacherNotificationSchema,
} from "schemas/teacherSchema";
import {
  HTTP_CODE_SERVER_ERROR,
  HTTP_CODE_SUCCESS,
  HTTP_CODE_SUCCESS_NO_CONTENT,
  HTTP_CODE_VALIDATION_ERROR,
  SERVER_ERROR,
} from "src/constants/generalConstants";
import {
  checkIfTeacherExists,
  extractEmailsFromNotification,
  getStudentsByTeacherEmails,
  getValidStudentsByEmails,
  suspendStudent,
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

  try {
    // Check if teacher exists, before we insert
    const isTeacherExists = await checkIfTeacherExists(teacher);
    if (!isTeacherExists) {
      await prisma.teacher.create({
        data: {
          email: teacher,
        },
      });
    }

    // Get all students
    const studentsDetails = students.map((student) => {
      return {
        email: student,
      };
    });

    // const isExists = await checkIfStudentsExists(students);
    // console.log("isExists: ", isExists);
    console.log("teacher: ", teacher);
    console.log("studentsDetails: ", studentsDetails);

    await prisma.teacher.upsert({
      where: { email: teacher },
      update: {
        students: {
          connectOrCreate: studentsDetails.map((student) => ({
            where: { email: student.email },
            create: { email: student.email },
          })),
        },
      },
      create: {
        email: teacher,
        students: {
          connectOrCreate: studentsDetails.map((student) => ({
            where: { email: student.email },
            create: { email: student.email },
          })),
        },
      },
    });
    res.status(HTTP_CODE_SUCCESS_NO_CONTENT).send();
  } catch (error: unknown) {
    console.error("error: ", error);
    res.status(HTTP_CODE_SERVER_ERROR).json({ error: SERVER_ERROR });
  }
};

export const getCommonStudents = async (req: Request, res: Response) => {
  const parseResult = getCommonStudentsQuerySchema.parse(req.query);
  const teacherEmails = parseResult.teacher;
  // console.log("teacherEmails: ", teacherEmails);

  try {
    const studentDetails = await getStudentsByTeacherEmails(teacherEmails);
    // console.log("studentDetails: ", studentDetails);
    res.json({ students: studentDetails });
  } catch (error: unknown) {
    console.error("error > ", error);
    res.status(HTTP_CODE_SERVER_ERROR).json({ error: SERVER_ERROR });
  }
};

/**
 * POST
 * @param req
 * @param res
 * @returns
 */
export const suspendStudentByEmail = async (req: Request, res: Response) => {
  const parseResult = suspendStudentSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parseResult.error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }

  const { student } = parseResult.data;
  // console.log("student: ", student);

  try {
    const isSuspended = await suspendStudent(student);
    // console.log("isSuspended: ", isSuspended);
    if (!isSuspended) {
      res
        .status(HTTP_CODE_VALIDATION_ERROR)
        .json({ message: "Unable to suspend student." });
    }
    res.status(HTTP_CODE_SUCCESS_NO_CONTENT).send();
  } catch (error: unknown) {
    console.error("error > ", error);
    res.status(HTTP_CODE_SERVER_ERROR).json({ error: SERVER_ERROR });
  }
};

export const sendNotificationForStudents = async (
  req: Request,
  res: Response
) => {
  const parseResult = teacherNotificationSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(HTTP_CODE_VALIDATION_ERROR).json({
      message: "Validation failed",
      errors: parseResult.error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }

  const { teacher, notification } = parseResult.data;

  try {
    // validate if teacher exists
    const isTeacherExists = await checkIfTeacherExists(teacher);
    if (!isTeacherExists) {
      res
        .status(HTTP_CODE_VALIDATION_ERROR)
        .json({ message: "The teacher doesn't exist." });
    }

    const studentEmails = await getStudentsByTeacherEmails([teacher]);

    // Get notified emails
    const mentionedEmails = extractEmailsFromNotification(notification);
    const filteredStudents = [
      ...new Set([...studentEmails, ...mentionedEmails]),
    ];
    // console.log("filteredStudents: ", filteredStudents);

    // Check if the notified emails are valid and not suspended
    const validStudents = await getValidStudentsByEmails(filteredStudents);
    // console.log("validStudents: ", validStudents);

    res.status(HTTP_CODE_SUCCESS).json({
      recipients: validStudents,
    });
  } catch (error: unknown) {
    console.error("error > ", error);
    res.status(HTTP_CODE_SERVER_ERROR).json({ error: SERVER_ERROR });
  }
};
