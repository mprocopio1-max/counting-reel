import { exec } from "child_process";
import fs from "fs";
import path from "path";
import ffmpegStatic from "ffmpeg-static";
import { env } from "../../config/env";
import { HttpError } from "../../utils/httpError";
import { TranscriptionProvider } from "./transcriptionProvider";

export class WhisperCliProvider implements TranscriptionProvider {
  async transcribe(audioPath: string): Promise<string> {
    const outputDir = env.tempDir;
    const outputBaseName = path.basename(audioPath, path.extname(audioPath));
    const ffmpegDir = ffmpegStatic ? path.dirname(ffmpegStatic) : "";
    const commandEnv = {
      ...process.env,
      PATH: ffmpegDir ? `${ffmpegDir}${path.delimiter}${process.env.PATH ?? ""}` : process.env.PATH
    };

    await new Promise<void>((resolve, reject) => {
      const command = `${env.WHISPER_CLI_PATH} "${audioPath}" --model ${env.WHISPER_MODEL} --output_format txt --output_dir "${outputDir}" --fp16 False`;

      exec(command, { env: commandEnv }, (error) => {
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
      });
    });

    const expectedTranscriptPath = path.join(outputDir, `${outputBaseName}.txt`);
    const transcriptPath = fs.existsSync(expectedTranscriptPath)
      ? expectedTranscriptPath
      : this.findBestTranscriptFile(outputDir, outputBaseName);

    if (!fs.existsSync(transcriptPath)) {
      throw new HttpError(500, "Whisper CLI finished without producing transcript file.");
    }

    const transcript = fs.readFileSync(transcriptPath, "utf-8").trim();

    if (!transcript) {
      throw new HttpError(500, "Empty transcript returned by Whisper CLI.");
    }

    return transcript;
  }

  private findBestTranscriptFile(outputDir: string, outputBaseName: string): string {
    const txtFiles = fs
      .readdirSync(outputDir)
      .filter((fileName) => fileName.toLowerCase().endsWith(".txt"));

    const byBaseName = txtFiles.find((fileName) =>
      fileName.toLowerCase().startsWith(outputBaseName.toLowerCase())
    );

    if (byBaseName) {
      return path.join(outputDir, byBaseName);
    }

    if (txtFiles.length === 0) {
      return path.join(outputDir, `${outputBaseName}.txt`);
    }

    const newest = txtFiles
      .map((fileName) => ({
        fileName,
        modifiedAt: fs.statSync(path.join(outputDir, fileName)).mtimeMs
      }))
      .sort((a, b) => b.modifiedAt - a.modifiedAt)[0].fileName;

    return path.join(outputDir, newest);
  }
}
