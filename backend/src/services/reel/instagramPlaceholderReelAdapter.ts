import { HttpError } from "../../utils/httpError";
import { ReelAdapter, ReelMedia } from "./reelAdapter";

export class InstagramPlaceholderReelAdapter implements ReelAdapter {
  async getMediaFromUrl(url: string): Promise<ReelMedia> {
    if (!url.includes("instagram.com/reel/")) {
      throw new HttpError(400, "The provided URL does not look like an Instagram reel link.");
    }

    throw new HttpError(
      501,
      "Instagram media retrieval is intentionally abstracted. Implement this adapter with your preferred compliant strategy."
    );
  }
}
