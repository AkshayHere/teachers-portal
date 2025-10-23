import { z } from "zod";

export const createTeacherSchema = z.object({
  teacher: z.email().trim(),
  students: z
    .array(z.email().trim())
    .nonempty("At least one student email is required."),
});

export const getCommonStudentsQuerySchema = z.object({
  teacher: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    // .nonempty("At least one teacher email is required"),
});
