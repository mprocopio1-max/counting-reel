import crypto from "crypto";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { env } from "../../config/env";
import { HttpError } from "../../utils/httpError";

const ffmpegPath = env.FFMPEG_PATH?.trim() || ffmpegStatic;

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

class ThumbnailService {
  async extractThumbnails(videoPath: string, frameCount = 4): Promise<string[]> {
    const runPrefix = `thumb-${Date.now()}-${crypto.randomUUID()}`;

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .on("end", () => {
          const fileNames = Array.from({ length: frameCount }, (_, index) => {
            const order = (index + 1).toString().padStart(2, "0");
            return `${runPrefix}-${order}.jpg`;
          });

          const publicPaths = fileNames.map((fileName) => `/output/${fileName}`);
          resolve(publicPaths);
        })
        .on("error", (error) => {
          reject(new HttpError(500, `Thumbnail extraction failed: ${error.message}`));
        })
        .screenshots({
          count: frameCount,
          filename: `${runPrefix}-%02i.jpg`,
          folder: path.resolve(env.outputDir),
          size: "640x?"
        });
    });
  }
}

export const thumbnailService = new ThumbnailService();
