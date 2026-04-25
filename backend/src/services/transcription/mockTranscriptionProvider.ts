import { TranscriptionProvider } from "./transcriptionProvider";

export class MockTranscriptionProvider implements TranscriptionProvider {
  async transcribe(_audioPath: string): Promise<string> {
    return "Ciao a tutti oggi parliamo di strategia contenuti social. Ciao creator, oggi vediamo come crescere su Instagram con costanza, analisi e creativita.";
  }
}
