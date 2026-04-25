import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { env } from "../../config/env";
import { HttpError } from "../../utils/httpError";
import { TranscriptionProvider } from "./transcriptionProvider";

export class WhisperCliProvider implements TranscriptionProvider {
  async transcribe(audioPath: string): Promise<string> {
    const outputDir = env.tempDir;
    const outputBaseName = path.basename(audioPath, path.extname(audioPath));

    await new Promise<void>((resolve, reject) => {
      execFile(
        env.WHISPER_CLI_PATH,
        [
          audioPath,
          "--model",
          env.WHISPER_MODEL,
          "--output_format",
          "txt",
          "--output_dir",
          outputDir,
          "--fp16",
          "False"
        ],
        (error) => {
          if (error) {
            reject(
              new HttpError(
                500,
                `Whisper CLI transcription failed. Ensure Whisper is installed and configured. Details: ${error.message}`
              )
            );
            return;
          }

          resolve();
        }
      );
    });

    const transcriptPath = path.join(outputDir, `${outputBaseName}.txt`);

    if (!fs.existsSync(transcriptPath)) {
      throw new HttpError(500, "Whisper CLI finished without producing transcript file.");
    }

    const transcript = fs.readFileSync(transcriptPath, "utf-8").trim();

    if (!transcript) {
      throw new HttpError(500, "Empty transcript returned by Whisper CLI.");
    }

    return transcript;
  }
}
