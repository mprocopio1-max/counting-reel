import fs from "fs";
import path from "path";
import { env } from "../../config/env";
import { HttpError } from "../../utils/httpError";
import { ReelAdapter, ReelMedia } from "./reelAdapter";

export class MockReelAdapter implements ReelAdapter {
  async getMediaFromUrl(url: string): Promise<ReelMedia> {
    const samplePath = env.SAMPLE_VIDEO_PATH?.trim();

    if (!samplePath) {
      throw new HttpError(
        503,
        "Mock adapter enabled but SAMPLE_VIDEO_PATH is empty. Configure a local video file to continue."
      );
    }

    const resolvedPath = path.resolve(samplePath);

    if (!fs.existsSync(resolvedPath)) {
      throw new HttpError(404, `Configured SAMPLE_VIDEO_PATH not found: ${resolvedPath}`);
    }

    return {
      sourceUrl: url,
      localVideoPath: resolvedPath
    };
  }
}
