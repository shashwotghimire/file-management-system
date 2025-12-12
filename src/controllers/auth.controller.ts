import { Request, Response, NextFunction } from "express";
import { signToken, verifyToken } from "../utils/jwt.utils";
import { hashPassword, verifyPassword } from "../utils/hashPassword.utils";
import { prisma } from "../utils/prisma.utils";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Error registering user",
        error: "Missing email or password",
        validationErrors: "",
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Error registering user",
        error: "user with that email already exists",
        validationError: "",
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, username },
    });
    const accessToken = signToken({
      id: user.id,
      email: user.email,
    });
    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        accessToken,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Error logging in user",
        error: "Missing email or password",
        validationError: "",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Error logging in user",
        error: "Invalid email or password",
        validationError: "",
      });
    }
    const hashedPassword = user.password;
    if (!(await verifyPassword(password, hashedPassword))) {
      return res.status(400).json({
        success: false,
        message: "Error loggin in user",
        error: "Invalid email or password",
        validationError: "",
      });
    }
    const accessToken = signToken({
      id: user.id,
      email: user.email,
    });
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
    next(e);
  }
};
