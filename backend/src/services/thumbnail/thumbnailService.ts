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
    const coverFileName = `${runPrefix}-cover.jpg`;

    await this.captureCoverFrame(videoPath, outputFolder, coverFileName);
    await this.captureTimelineFrames(videoPath, outputFolder, runPrefix, frameCount);

    const frameFileNames = fs
      .readdirSync(outputFolder)
      .filter((fileName) => {
        const isMatchingPrefix = fileName.startsWith(runPrefix);
        const isJpg = fileName.toLowerCase().endsWith(".jpg");
        const isFrame = fileName.includes("-frame");
        return isMatchingPrefix && isJpg && isFrame;
      })
      .sort((a, b) => a.localeCompare(b))
      .slice(0, frameCount);

    const allFileNames = [coverFileName, ...frameFileNames].filter((fileName) =>
      fs.existsSync(path.join(outputFolder, fileName))
    );

    if (allFileNames.length === 0) {
      throw new HttpError(500, "Thumbnail extraction finished but no output files were found.");
    }

    return allFileNames.map((fileName) => `/output/${fileName}`);
  }

  private captureCoverFrame(videoPath: string, outputFolder: string, coverFileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .on("end", () => resolve())
        .on("error", (error) => {
          reject(new HttpError(500, `Cover extraction failed: ${error.message}`));
        })
        .screenshots({
          timemarks: ["0"],
          filename: coverFileName,
          folder: outputFolder,
          size: "640x?"
        });
    });
  }

  private captureTimelineFrames(
    videoPath: string,
    outputFolder: string,
    runPrefix: string,
    frameCount: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .on("end", () => resolve())
        .on("error", (error) => {
          reject(new HttpError(500, `Frame extraction failed: ${error.message}`));
        })
        .screenshots({
          count: frameCount,
          filename: `${runPrefix}-frame.jpg`,
          folder: outputFolder,
          size: "640x?"
        });
    });
  }
}

export const thumbnailService = new ThumbnailService();
