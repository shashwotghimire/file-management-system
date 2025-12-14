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

export const downloadFileById = async (
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

export const downloadFileByName = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileName } = req.params;
    const userId = req.user.id;
    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: "Download failed",
        error: "Filename is required",
      });
    }
    const file = await prisma.file.findFirst({
      where: { name: fileName, userId },
    });
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Download failed",
        error: "File not found",
      });
    }
    res.sendFile(file.path);
  } catch (e) {
    next(e);
  }
};

export const uploadFileToFolder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Error uploading file",
        error: "No file uploaded",
      });
    }
    const { originalname, mimetype, path, size } = req.file;
    const { folderId } = req.params;
    const userId = req.user.id;

    if (!folderId) {
      return res.status(400).json({
        success: false,
        message: "Error uploading file",
        error: "Folder id required",
      });
    }
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });
    if (!folder || folder.ownerId !== userId) {
      return res.status(400).json({
        success: false,
        message: "Error uploading file",
        error: "Invalid folder",
      });
    }

    const file = await prisma.file.create({
      data: {
        name: originalname,
        mimeType: mimetype,
        size,
        path,
        folderId,
        userId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        file,
      },
    });
  } catch (e) {
    if (req.file) {
      unlinkSync(req.file.path);
    }
    next(e);
  }
};
