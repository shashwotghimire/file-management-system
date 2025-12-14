import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { prisma } from "../utils/prisma.utils";

export const createFolder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Failed to create folder",
        error: "Folder name is required",
      });
    }
    const folder = await prisma.folder.create({
      data: {
        name,
        ownerId: userId,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Folder created successfully",
      data: {
        folder,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const renameFolder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;
    const { folderName } = req.body;
    const userId = req.user.id;
    if (!folderId || !folderName) {
      return res.status(400).json({
        success: false,
        message: "Failed to rename folder",
        error: "Folder id or name required",
      });
    }
    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        ownerId: userId,
      },
    });
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Failed to rename folder",
        error: "Folder not found",
      });
    }
    if (folder.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Failed to rename folder",
        error: "Access denied",
      });
    }
    const updatedFolder = await prisma.folder.update({
      where: { id: folderId },
      data: { name: folderName },
    });
    return res.status(200).json({
      success: true,
      message: "Folder renamed successfully",
      data: {
        updatedFolder,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const deleteFolder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;
    const userId = req.user.id;
    if (!folderId) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete file",
        error: "Folder id is required",
      });
    }
    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        ownerId: userId,
      },
    });
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Failed to delete folder",
        error: "Folder not found",
      });
    }
    if (folder.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Failed to delete folder",
        error: "Access denied",
      });
    }
    await prisma.file.updateMany({
      where: { folderId: folder.id },
      data: { folderId: null },
    });
    await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Deleted folder successfully",
      data: null,
    });
  } catch (e) {
    next(e);
  }
};

export const organizeFiles = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.params;
    const { folderId } = req.body;
    const userId = req.user.id;
    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "Error organizing files",
        error: "File id required",
      });
    }
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Error organizing files",
        error: "File not found",
      });
    }
    if (file.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Error organizing files",
        error: "Access denied",
      });
    }
    const folder = await prisma.folder.findUnique({ where: { id: folderId } });
    if (!folder || folder.ownerId !== userId) {
      return res.status(404).json({
        success: false,
        message: "Error organizing files",
        error: "Invalid folder",
      });
    }
    const updatedFile = await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        folderId: folder.id,
      },
    });
    return res.status(200).json({
      success: true,
      message: "File organized successfully",
      data: {
        updatedFile,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const listFolders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const offset = (page - 1) * limit;
    const folders = await prisma.folder.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        files: {
          select: {
            id: true,
            name: true,
            path: true,
            size: true,
          },
        },
      },
      skip: offset,
      take: limit,
    });
    const total = await prisma.folder.count({ where: { ownerId: userId } });
    return res.status(200).json({
      success: true,
      message: "Listed user's folders successfully",
      data: {
        pagination: {
          limit,
          page,
          offset,
          total,
          totalPages: Math.ceil(total / limit),
        },
        folders,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const listFilesInFolder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const { folderId } = req.params;
    if (!folderId) {
      return res.status(400).json({
        success: false,
        message: "Error fetching files",
        error: "Folder id required",
      });
    }
    const folder = await prisma.folder.findFirst({
      where: { ownerId: userId, id: folderId },
    });
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Error fetching files",
        error: "FOlder not found",
      });
    }
    const files = await prisma.file.findMany({
      where: {
        folderId,
      },
      skip: offset,
      take: limit,
    });
    const total = await prisma.file.count({ where: { folderId } });
    return res.status(200).json({
      success: true,
      message: "Fetched files successfully",
      data: {
        pagination: {
          page,
          limit,
          offset,
          total,
          totalPages: Math.ceil(total / limit),
        },
        files,
      },
    });
  } catch (e) {
    next(e);
  }
};
