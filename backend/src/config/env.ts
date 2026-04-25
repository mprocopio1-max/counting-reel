import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_ORIGIN: z.string().default("http://localhost:5173"),
  TRANSCRIPTION_PROVIDER: z.enum(["mock", "whisper-cli"]).default("mock"),
  WHISPER_CLI_PATH: z.string().default("whisper"),
  WHISPER_MODEL: z.string().default("base"),
  REEL_ADAPTER: z.enum(["mock", "instagram-placeholder"]).default("mock"),
  SAMPLE_VIDEO_PATH: z.string().optional(),
  FFMPEG_PATH: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables", parsed.error.flatten().fieldErrors);
  throw new Error("Environment validation failed");
}

const rootDir = path.resolve(__dirname, "../../");

export const env = {
  ...parsed.data,
  port: parsed.data.PORT,
  nodeEnv: parsed.data.NODE_ENV,
  frontendOrigin: parsed.data.FRONTEND_ORIGIN,
  tempDir: path.join(rootDir, "temp"),
  outputDir: path.join(rootDir, "output")
};
