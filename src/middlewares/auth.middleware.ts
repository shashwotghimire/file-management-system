import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user: TokenPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders || !authHeaders.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        error: "Missing/Invalid token or expired",
      });
    }
    const token: any = authHeaders.split(" ")[1];
    const decoded = verifyToken(token) as TokenPayload;
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      error: "Token expired or invalid",
    });
  }
};
