import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  downloadFile,
  retrieveUserFiles,
  uploadFile,
} from "../controllers/file.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.post(
  "/upload",
  authMiddleware as any,
  upload.single("file") as any,
  uploadFile as any
);
router.get("/:fileId", authMiddleware as any, downloadFile as any);
router.get("/", authMiddleware as any, retrieveUserFiles as any);

export default router;
