import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { prisma } from "../utils/prisma.utils";
import { unlinkSync } from "node:fs";
export const uploadFile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Failed to upload file",
        error: "No file uploaded",
      });
    }
    const { originalname, path, size, mimetype } = req.file;
    const userId = req.user.id;
    const folderId = req.body.folderId || null;
    const file = await prisma.file.create({
      data: {
        name: originalname,
        path,
        size,
        mimeType: mimetype,
        userId,
        folderId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "file uploaded successfully",
      data: {
        file,
      },
    });
  } catch (error) {
    if (req.file) {
      unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const retrieveUserFiles = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const files = await prisma.file.findMany({ where: { userId } });
    return res.status(200).json({
      success: true,
      message: "User's files retrieved successfully",
      data: { files },
    });
  } catch (e) {
    next(e);
  }
};

export const downloadFile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;
    const file = await prisma.file.findUnique({ where: { id: fileId! } });
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Download failed",
        error: "File not found",
      });
    }
    if (file.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Download failed",
        error: "Unauthorized user",
      });
    }
    return res.sendFile(file.path);
  } catch (e) {
    next(e);
  }
};
