import { env } from "../../config/env";
import { ReelAdapter, ReelMedia } from "./reelAdapter";
import { InstagramPlaceholderReelAdapter } from "./instagramPlaceholderReelAdapter";
import { MockReelAdapter } from "./mockReelAdapter";

class ReelService {
  private readonly adapter: ReelAdapter;

  constructor(adapter: ReelAdapter) {
    this.adapter = adapter;
  }

  async resolveMediaFromUrl(url: string): Promise<ReelMedia> {
    return this.adapter.getMediaFromUrl(url);
  }
}

const selectedAdapter: ReelAdapter =
  env.REEL_ADAPTER === "instagram-placeholder"
    ? new InstagramPlaceholderReelAdapter()
    : new MockReelAdapter();

export const reelService = new ReelService(selectedAdapter);
