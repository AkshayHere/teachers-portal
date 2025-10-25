import { Request, Response } from "express";
import * as teacherController from "src/controllers/teacherController";
import prisma from "prisma/client";
import { HTTP_CODE_SERVER_ERROR, SERVER_ERROR } from "src/constants/generalConstants";

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
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getTeachers", () => {
  it("should return a list of teachers", async () => {
    const req = {} as Request;
    const res = mockResponse();

    (prisma.teacher.findMany as jest.Mock).mockResolvedValue([
      { id: 1, email: "teacher1@example.com" },
      { id: 2, email: "teacher2@example.com" },
    ]);

    await teacherController.getTeachers(req, res);

    expect(prisma.teacher.findMany).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, email: "teacher1@example.com" },
      { id: 2, email: "teacher2@example.com" },
    ]);
  });

  it("should handle errors", async () => {
    const req = {} as Request;
    const res = mockResponse();

    (prisma.teacher.findMany as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    await teacherController.getTeachers(req, res);
    expect(res.status).toHaveBeenCalledWith(HTTP_CODE_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error: SERVER_ERROR });
  });
});
