import { Request, Response } from "express";
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

describe("getCommonStudents", () => {
  it("should return students for given teachers", async () => {
    const req = {
      query: { teacher: ["teacher@example.com"] },
    } as unknown as Request;
    const res = mockResponse();

    (teacherService.getStudentsByTeacherEmails as jest.Mock).mockResolvedValue([
      "student1@example.com",
    ]);

    await teacherController.getCommonStudents(req, res);

    expect(res.json).toHaveBeenCalledWith({
      students: ["student1@example.com"],
    });
  });
});
