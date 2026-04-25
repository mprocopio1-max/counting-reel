import { env } from "../../config/env";
import { MockTranscriptionProvider } from "./mockTranscriptionProvider";
import { TranscriptionProvider } from "./transcriptionProvider";
import { WhisperCliProvider } from "./whisperCliProvider";

class TranscriptionService {
  private readonly provider: TranscriptionProvider;

  constructor(provider: TranscriptionProvider) {
    this.provider = provider;
  }

  async transcribe(audioPath: string): Promise<string> {
    return this.provider.transcribe(audioPath);
  }
}

const provider: TranscriptionProvider =
  env.TRANSCRIPTION_PROVIDER === "whisper-cli"
    ? new WhisperCliProvider()
    : new MockTranscriptionProvider();

export const transcriptionService = new TranscriptionService(provider);
