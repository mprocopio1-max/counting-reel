export interface TopWord {
  word: string;
  count: number;
}

export interface AnalyzeData {
  transcript: string;
  topWords: TopWord[];
  thumbnails: string[];
}

export interface AnalyzeSuccessResponse {
  success: true;
  data: AnalyzeData;
}

export interface AnalyzeErrorResponse {
  success: false;
  error: string;
}
