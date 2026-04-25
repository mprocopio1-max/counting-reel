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

class AudioService {
  async extractAudio(videoPath: string): Promise<string> {
    const audioFileName = `audio-${Date.now()}-${crypto.randomUUID()}.wav`;
    const audioPath = path.join(env.tempDir, audioFileName);

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .noVideo()
        .audioCodec("pcm_s16le")
        .audioFrequency(16000)
        .audioChannels(1)
        .format("wav")
        .save(audioPath)
        .on("end", () => resolve(audioPath))
        .on("error", (error) => {
          reject(new HttpError(500, `Audio extraction failed: ${error.message}`));
        });
    });
  }
}

export const audioService = new AudioService();
