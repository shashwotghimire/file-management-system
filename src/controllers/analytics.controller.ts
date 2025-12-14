import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { prisma } from "../utils/prisma.utils";

export const userAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const totalFilesUploaded = await prisma.file.count({ where: { userId } });
    const totalStorageUsed = await prisma.file.aggregate({
      where: { userId },
      _sum: { size: true },
    });
    return res.status(200).json({
      success: true,
      message: "Analytics calculated successfully",
      data: {
        totalFilesUploaded,
        totalStorageUsed,
      },
    });
  } catch (e) {
    next(e);
  }
};
