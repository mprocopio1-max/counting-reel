import crypto from "crypto";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import ffprobeBinary from "ffprobe-static";
import { env } from "../../config/env";
import { HttpError } from "../../utils/httpError";

const ffmpegPath = env.FFMPEG_PATH?.trim() || ffmpegStatic;

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

if (ffprobeBinary.path) {
  ffmpeg.setFfprobePath(ffprobeBinary.path);
}

class ThumbnailService {
  async extractThumbnails(videoPath: string, frameCount = 4): Promise<string[]> {
    const runPrefix = `thumb-${Date.now()}-${crypto.randomUUID()}`;
    const outputFolder = path.resolve(env.outputDir);

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .on("end", () => {
          const fileNames = fs
            .readdirSync(outputFolder)
            .filter((fileName) => fileName.startsWith(runPrefix) && fileName.toLowerCase().endsWith(".jpg"))
            .sort((a, b) => a.localeCompare(b))
            .slice(0, frameCount);

          if (fileNames.length === 0) {
            reject(new HttpError(500, "Thumbnail extraction finished but no output files were found."));
            return;
          }

          const publicPaths = fileNames.map((fileName) => `/output/${fileName}`);
          resolve(publicPaths);
        })
        .on("error", (error) => {
          reject(new HttpError(500, `Thumbnail extraction failed: ${error.message}`));
        })
        .screenshots({
          count: frameCount,
          filename: `${runPrefix}.jpg`,
          folder: outputFolder,
          size: "640x?"
        });
    });
  }
}

export const thumbnailService = new ThumbnailService();
