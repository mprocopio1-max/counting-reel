export interface ReelMedia {
  sourceUrl: string;
  localVideoPath: string;
}

export interface ReelAdapter {
  getMediaFromUrl(url: string): Promise<ReelMedia>;
}
