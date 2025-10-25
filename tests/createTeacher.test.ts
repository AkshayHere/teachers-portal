import { Request, Response } from "express";
import * as teacherController from "src/controllers/teacherController";
import prisma from "prisma/client";
import * as teacherService from "src/services/teacherService";
import { HTTP_CODE_DUPLICATE_RECORD, HTTP_CODE_SUCCESS_NO_CONTENT } from "src/constants/generalConstants";

// Mock Prisma
jest.mock("prisma/client", () => ({
  teacher: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock services
jest.mock("src/services/teacherService", () => ({
  checkIfTeacherExists: jest.fn(),
  checkIfStudentsExists: jest.fn(),
  getStudentsByTeacherEmails: jest.fn(),
  getValidStudentsByEmails: jest.fn(),
  suspendStudent: jest.fn(),
  extractEmailsFromNotification: jest.fn(),
}));

// Mock response object
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
  (console.log as jest.Mock).mockRestore();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createTeacher", () => {
  it("should create a teacher and students", async () => {
    const req = {
      body: {
        teacher: "teacher@example.com",
        students: ["student1@example.com", "student2@example.com"],
      },
    } as Request;
    const res = mockResponse();

    (teacherService.checkIfTeacherExists as jest.Mock).mockResolvedValue(false);
    (teacherService.checkIfStudentsExists as jest.Mock).mockResolvedValue(
      false
    );
    (prisma.teacher.create as jest.Mock).mockResolvedValue({
      id: 1,
      email: "teacher@example.com",
    });

    await teacherController.createTeacher(req, res);

    expect(prisma.teacher.create).toHaveBeenCalledWith({
      data: {
        email: "teacher@example.com",
        students: {
          create: [
            { email: "student1@example.com" },
            { email: "student2@example.com" },
          ],
        },
      },
    });

    expect(res.status).toHaveBeenCalledWith(HTTP_CODE_SUCCESS_NO_CONTENT);
    expect(res.send).toHaveBeenCalled();
  });

  it("should return error if teacher exists", async () => {
    const req = {
      body: {
        teacher: "teacher@example.com",
        students: ["student1@gmail.com"],
      },
    } as Request;
    const res = mockResponse();

    (teacherService.checkIfTeacherExists as jest.Mock).mockResolvedValue(true);
    await teacherController.createTeacher(req, res);
    expect(res.status).toHaveBeenCalledWith(HTTP_CODE_DUPLICATE_RECORD);
    expect(res.json).toHaveBeenCalledWith({
      error: "Teacher email already exists.",
    });
  });
});
