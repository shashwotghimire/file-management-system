import { z } from "zod";

export const createFolderSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Folder name is required")
      .max(100, "Folder name too long"),
  }),
});

export const renameFolderSchema = z.object({
  params: z.object({
    folderId: z.string().min(1, "Folder id is required"),
  }),
  body: z.object({
    folderName: z
      .string()
      .min(1, "Folder name is required")
      .max(100, "Folder name too long"),
  }),
});

export const deleteFolderSchema = z.object({
  params: z.object({
    folderId: z.string().min(1, "Folder id is required"),
  }),
});

export const listFilesInFolderSchema = z.object({
  params: z.object({
    folderId: z.string().min(1, "Folder id is required"),
  }),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
