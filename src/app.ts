import express from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";

import authRoutes from "./routes/auth.routes";
// import testRoutes from "./routes/test.routes";
import fileRoutes from "./routes/file.routes";
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
// app.use("/api/test", testRoutes);
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "api working",
  });
});

app.use(errorHandler);
export default app;
