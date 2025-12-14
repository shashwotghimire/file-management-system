import { z } from "zod";

export const uploadFileSchema = z.object({
  body: z.object({
    folderId: z.string().optional().nullable(),
  }),
});

export const uploadFileToFolderSchema = z.object({
  params: z.object({
    folderId: z.string().min(1, "Folder id is required"),
  }),
});

export const downloadFileByIdSchema = z.object({
  params: z.object({
    fileId: z.string().min(1, "File id is required"),
  }),
});

export const downloadFileByNameSchema = z.object({
  params: z.object({
    fileName: z
      .string()
      .min(1, "File name is required")
      .max(255, "File name too long"),
  }),
});

export const organizeFileSchema = z.object({
  params: z.object({
    fileId: z.string().min(1, "File id is required"),
  }),
  body: z.object({
    folderId: z.string().min(1, "Folder id is required"),
  }),
});

export const deleteFileSchema = z.object({
  params: z.object({
    fileId: z.string().min(1, "File id is required"),
  }),
});
