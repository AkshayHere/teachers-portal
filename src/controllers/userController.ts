import { Request, Response } from "express";
import { createUserSchema } from "schemas/userSchema";
import prisma from "prisma/client";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const parseResult = createUserSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      errors: parseResult.error.format(),
    });
  }

  const { name, email } = parseResult.data;

  try {
    const user = await prisma.user.create({
      data: { name, email },
    });

    res.status(201).json(user);
  } catch (error: unknown) {
    console.error(`Email already exists: ${error}`);
    res.status(500).json({ error: "Something went wrong" });
  }
};
