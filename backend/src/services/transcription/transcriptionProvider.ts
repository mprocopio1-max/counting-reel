export interface TranscriptionProvider {
  transcribe(audioPath: string): Promise<string>;
}
