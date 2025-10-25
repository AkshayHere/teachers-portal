import { Request, Response } from "express";
import { HTTP_CODE_SUCCESS_NO_CONTENT } from "src/constants/generalConstants";
import * as teacherController from "src/controllers/teacherController";
import * as teacherService from "src/services/teacherService";

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

describe("suspendStudentByEmail", () => {
  it("should suspend student", async () => {
    const req = { body: { student: "student1@example.com" } } as Request;
    const res = mockResponse();

    (teacherService.suspendStudent as jest.Mock).mockResolvedValue(true);
    await teacherController.suspendStudentByEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(HTTP_CODE_SUCCESS_NO_CONTENT);
    expect(res.send).toHaveBeenCalled();
  });
});
