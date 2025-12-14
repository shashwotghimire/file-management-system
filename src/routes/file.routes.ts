import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { limiter } from "../middlewares/rateLimit.middleware";
import { validate } from "../middlewares/validate.middleware";

import {
  uploadFile,
  uploadFileToFolder,
  retrieveUserFiles,
  downloadFileById,
  downloadFileByName,
} from "../controllers/file.controller";

import {
  uploadFileSchema,
  uploadFileToFolderSchema,
  downloadFileByIdSchema,
  downloadFileByNameSchema,
} from "../validations/file.validation";

const router = Router();

router.use(authMiddleware);
router.use(limiter);

router.post(
  "/upload",
  upload.single("file"),
  validate(uploadFileSchema),
  uploadFile as RequestHandler
);

router.post(
  "/upload/folder/:folderId",
  upload.single("file"),
  validate(uploadFileToFolderSchema),
  uploadFileToFolder as RequestHandler
);

router.get("/", retrieveUserFiles as RequestHandler);

router.get(
  "/download/id/:fileId",
  validate(downloadFileByIdSchema),
  downloadFileById as RequestHandler
);

router.get(
  "/download/name/:fileName",
  validate(downloadFileByNameSchema),
  downloadFileByName as RequestHandler
);

export default router;
