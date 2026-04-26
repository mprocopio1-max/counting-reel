import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { analyzeController, analyzeUploadController } from "../controllers/analyzeController";
import { env } from "../config/env";
import { HttpError } from "../utils/httpError";

export const analyzeRoutes = Router();

const upload = multer({
	storage: multer.diskStorage({
		destination: (_req, _file, callback) => {
			callback(null, env.tempDir);
		},
		filename: (_req, file, callback) => {
			const extension = path.extname(file.originalname || ".mp4");
			const safeExtension = extension || ".mp4";
			callback(null, `uploaded-${Date.now()}-${crypto.randomUUID()}${safeExtension}`);
		}
	}),
	limits: {
		fileSize: 1024 * 1024 * 100
	},
	fileFilter: (_req, file, callback) => {
		const extension = path.extname(file.originalname || "").toLowerCase();
		const allowedExtensions = new Set([".mp4", ".mov", ".webm", ".mkv", ".avi"]);
		const isVideo = file.mimetype.startsWith("video/") || allowedExtensions.has(extension);

		if (!isVideo) {
			callback(new HttpError(400, "Invalid file type. Upload a video file."));
			return;
		}

		callback(null, true);
	}
});

analyzeRoutes.post("/analyze", analyzeController);
analyzeRoutes.post("/analyze-upload", upload.single("video"), analyzeUploadController);
