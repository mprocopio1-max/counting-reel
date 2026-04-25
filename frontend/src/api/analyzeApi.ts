import { AnalyzeErrorResponse, AnalyzeSuccessResponse } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export const resolveApiBaseUrl = (): string => API_BASE_URL.replace(/\/$/, "");

export const resolvePublicAssetUrl = (path: string): string => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${resolveApiBaseUrl()}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const analyzeReel = async (url: string): Promise<AnalyzeSuccessResponse> => {
  const response = await fetch(`${resolveApiBaseUrl()}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  });

  const payload = (await response.json()) as AnalyzeSuccessResponse | AnalyzeErrorResponse;

  if (!response.ok || !payload.success) {
    const message = (payload as AnalyzeErrorResponse).error || "Analysis failed.";
    throw new Error(message);
  }

  return payload as AnalyzeSuccessResponse;
};
