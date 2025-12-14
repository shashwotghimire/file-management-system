import { Request, Response, NextFunction } from "express";
import { signToken } from "../utils/jwt.utils";
import { hashPassword, verifyPassword } from "../utils/hashPassword.utils";
import { prisma } from "../utils/prisma.utils";

// Register user
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("User with that email already exists");
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, username },
    });

    const accessToken = signToken({ id: user.id, email: user.email });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        accessToken,
      },
    });
  } catch (e) {
    next(e); // all errors go to errorHandler now
  }
};

// Login user
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.password))) {
      throw new Error("Invalid email or password");
    }

    const accessToken = signToken({ id: user.id, email: user.email });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          accessToken,
        },
      },
    });
  } catch (e) {
    next(e); // all errors go to errorHandler now
  }
};
