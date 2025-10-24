import { z } from "zod";

export const createTeacherSchema = z.object({
  teacher: z.email().trim().nonempty("Teacher is required"),
  students: z
    .array(z.email().trim())
    .nonempty("At least one student email is required."),
});

export const getCommonStudentsQuerySchema = z.object({
  teacher: z
    .union([z.string().trim(), z.array(z.string().trim())])
    .transform((val) => (Array.isArray(val) ? val : [val])),
});

export const suspendStudentSchema = z.object({
  student: z.email().trim().nonempty("Student is required"),
});

export const teacherNotificationSchema = z.object({
  teacher: z.email().trim().nonempty("Teacher is required"),
  notification: z
    .string()
    .trim()
    .max(150, "Maximum 150 characters allowed.")
    .min(10, "Minimum 10 characters required.")
    .nonempty("Notification message is required"),
});
