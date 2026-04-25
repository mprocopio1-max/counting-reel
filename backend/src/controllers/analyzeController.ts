import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { textAnalysisService } from "../services/analysis/textAnalysisService";
import { audioService } from "../services/media/audioService";
import { reelService } from "../services/reel/reelService";
import { thumbnailService } from "../services/thumbnail/thumbnailService";
import { transcriptionService } from "../services/transcription/transcriptionService";
import { AnalyzeResponse } from "../types/analyze";
import { HttpError } from "../utils/httpError";

const analyzeRequestSchema = z.object({
  url: z.string().url()
});

export const analyzeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = analyzeRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new HttpError(400, "Invalid payload. Expected a valid url field.");
    }

    const { url } = parsed.data;
    const media = await reelService.resolveMediaFromUrl(url);
    const audioPath = await audioService.extractAudio(media.localVideoPath);
    const transcript = await transcriptionService.transcribe(audioPath);
    const topWords = textAnalysisService.getTopWords(transcript, 20);
    const thumbnails = await thumbnailService.extractThumbnails(media.localVideoPath, 4);

    const response: AnalyzeResponse = {
      success: true,
      data: {
        transcript,
        topWords,
        thumbnails
      }
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
