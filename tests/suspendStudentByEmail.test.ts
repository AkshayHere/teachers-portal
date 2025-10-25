import { Request, Response } from "express";
import { HTTP_CODE_SUCCESS } from "src/constants/generalConstants";
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

describe("sendNotificationForStudents", () => {
  it("should send notification to valid students", async () => {
    const req = {
      body: {
        teacher: "teacher@example.com",
        notification: "Hello @student1@example.com",
      },
    } as Request;
    const res = mockResponse();

    (teacherService.checkIfTeacherExists as jest.Mock).mockResolvedValue(true);
    (teacherService.getStudentsByTeacherEmails as jest.Mock).mockResolvedValue([
      "student2@example.com",
    ]);
    (teacherService.extractEmailsFromNotification as jest.Mock).mockReturnValue(
      ["student1@example.com"]
    );
    (teacherService.getValidStudentsByEmails as jest.Mock).mockResolvedValue([
      "student1@example.com",
      "student2@example.com",
    ]);

    await teacherController.sendNotificationForStudents(req, res);

    expect(res.status).toHaveBeenCalledWith(HTTP_CODE_SUCCESS);
    expect(res.json).toHaveBeenCalledWith({
      recipients: ["student1@example.com", "student2@example.com"],
    });
  });
});
