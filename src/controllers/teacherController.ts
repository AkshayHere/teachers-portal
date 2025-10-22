import { Request, Response } from "express";
// import { createUserSchema } from "schemas/userSchema";
import prisma from "prisma/client";

export const getTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await prisma.teacher.findMany();
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const createUser = async (req: Request, res: Response) => {
//   const parseResult = createUserSchema.safeParse(req.body);

//   if (!parseResult.success) {
//     return res.status(400).json({
//       errors: parseResult.error.format(),
//     });
//   }

//   const { name, email } = parseResult.data;

//   try {
//     const user = await prisma.user.create({
//       data: { name, email },
//     });

//     res.status(201).json(user);
//   } catch (error: any) {
//     if (error.code === "P2002") {
//       return res.status(409).json({ error: "Email already exists" });
//     }

//     res.status(500).json({ error: "Something went wrong" });
//   }
// };
