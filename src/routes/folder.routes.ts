import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createFolder,
  renameFolder,
  deleteFolder,
  organizeFiles,
  listFolders,
  listFilesInFolder,
} from "../controllers/folder.controller";
import { limiter } from "../middlewares/rateLimit.middleware";

import {
  createFolderSchema,
  renameFolderSchema,
  deleteFolderSchema,
  listFilesInFolderSchema,
} from "../validations/folder.validation";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.use(limiter);
router.use(authMiddleware);

router.post(
  "/create",
  validate(createFolderSchema),
  createFolder as RequestHandler
);
router.patch(
  "/rename/:folderId",
  validate(renameFolderSchema),
  renameFolder as RequestHandler
);
router.delete(
  "/delete/:folderId",
  validate(deleteFolderSchema),
  deleteFolder as RequestHandler
);
router.get("/list", listFolders as RequestHandler);
router.get(
  "/:folderId/files",
  validate(listFilesInFolderSchema),
  listFilesInFolder as RequestHandler
);
router.patch("/organize/:fileId", organizeFiles as RequestHandler);

export default router;
