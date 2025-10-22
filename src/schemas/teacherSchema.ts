import { z } from "zod";

export const createTeacherSchema = z.object({
  email: z.email("Invalid email format"),
});

export const registerStudentsSchema = z.object({
  teacher: z.email(),
  students: z
    .array(z.email())
    .nonempty("At least one student email is required."),
});
