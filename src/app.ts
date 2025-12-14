import express from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";

import authRoutes from "./routes/auth.routes";
// import testRoutes from "./routes/test.routes";
import fileRoutes from "./routes/file.routes";
import folderRoutes from "./routes/folder.routes";
import analyticsRoutes from "./routes/analytics.routes";
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
// app.use("/api/test", testRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "api working",
  });
});

app.use(errorHandler);
export default app;
