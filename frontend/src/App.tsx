import { useMemo, useState } from "react";
import { analyzeReel, analyzeUploadedVideo, resolvePublicAssetUrl } from "./api/analyzeApi";
import { ThumbnailGallery } from "./components/ThumbnailGallery";
import { TopWordsTable } from "./components/TopWordsTable";
import { TranscriptCard } from "./components/TranscriptCard";
import { UploadForm } from "./components/UploadForm";
import { UrlForm } from "./components/UrlForm";
import { AnalyzeData } from "./types/api";

function App(): JSX.Element {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeData | null>(null);

  const thumbnailUrls = useMemo(() => {
    if (!result) {
      return [];
    }

    return result.thumbnails.map((thumbnailPath) => resolvePublicAssetUrl(thumbnailPath));
  }, [result]);

  const handleAnalyze = async (): Promise<void> => {
    if (!url.trim()) {
      setError("Please paste a reel URL before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await analyzeReel(url.trim());
      setResult(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeUpload = async (file: File): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await analyzeUploadedVideo(file);
      setResult(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="hero">
        <p className="eyebrow">Instagram Reel Intelligence</p>
        <h1>Analyze spoken content and key frames in one click</h1>
        <p className="hero-subtitle">
          Paste a reel URL and get transcript, top repeated words and thumbnail extraction from the backend pipeline.
        </p>
      </header>

      <main className="main-layout">
        <section className="panel form-panel">
          <UrlForm url={url} onUrlChange={setUrl} onSubmit={handleAnalyze} loading={loading} />
          <UploadForm onSubmitFile={handleAnalyzeUpload} loading={loading} />
          {loading ? <p className="loading-text">Analysis in progress, please wait...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}
        </section>

        {result ? (
          <section className="results-grid">
            <TranscriptCard transcript={result.transcript} />
            <TopWordsTable words={result.topWords} />
            <ThumbnailGallery images={thumbnailUrls} />
          </section>
        ) : (
          <section className="panel intro-panel">
            <h2>Ready to start</h2>
            <p>
              Submit a URL to trigger the full backend flow: media resolution, audio extraction, transcription, word
              frequency analysis and frame capture.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
