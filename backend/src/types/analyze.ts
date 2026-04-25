export interface TopWord {
  word: string;
  count: number;
}

export interface AnalyzeData {
  transcript: string;
  topWords: TopWord[];
  thumbnails: string[];
}

export interface AnalyzeResponse {
  success: true;
  data: AnalyzeData;
}
