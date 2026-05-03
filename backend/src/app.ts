import cors from "cors";
import express from "express";
import fs from "fs";
import morgan from "morgan";
import path from "path";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { analyzeRoutes } from "./routes/analyzeRoutes";

const ensureDirectory = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDirectory(env.tempDir);
ensureDirectory(env.outputDir);

export const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isConfiguredOrigin = origin === env.frontendOrigin;
      const isLocalhostDevOrigin = /^http:\/\/localhost:\d+$/.test(origin);

      if (isConfiguredOrigin || isLocalhostDevOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use("/output", express.static(path.resolve(env.outputDir)));

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "ok" });
});

app.use("/api", analyzeRoutes);
app.use(errorHandler);
