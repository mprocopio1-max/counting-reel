import { useState } from "react";

interface ThumbnailGalleryProps {
  images: string[];
}

export function ThumbnailGallery({ images }: ThumbnailGalleryProps): JSX.Element {
  const [downloading, setDownloading] = useState(false);

  const getCardLabel = (src: string, index: number): string => {
    if (src.includes("-cover")) {
      return "Cover";
    }

    const frameMatch = src.match(/_([0-9]+)\.jpg$/i);
    if (frameMatch) {
      return `Frame ${frameMatch[1]}`;
    }

    return `Frame ${index + 1}`;
  };

  const handleDownloadFrames = async (): Promise<void> => {
    if (images.length === 0 || downloading) {
      return;
    }

    setDownloading(true);

    try {
      for (const [index, src] of images.entries()) {
        const response = await fetch(src);

        if (!response.ok) {
          throw new Error("Failed to download one of the extracted frames.");
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const fileNameFromUrl = src.split("/").pop() || "";
        const extMatch = fileNameFromUrl.match(/\.(\w+)$/);
        const ext = extMatch ? `.${extMatch[1]}` : ".jpg";

        link.href = blobUrl;
        link.download = `${index + 1}${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Download failed.";
      alert(message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="panel">
      <div className="thumb-actions">
        <h2>Thumbnails</h2>
        {images.length > 0 ? (
          <button
            type="button"
            className="download-button"
            onClick={handleDownloadFrames}
            disabled={downloading}
          >
            {downloading ? "Downloading..." : "Download Images"}
          </button>
        ) : null}
      </div>
      {images.length === 0 ? (
        <p className="empty-state">No thumbnails available.</p>
      ) : (
        <div className="thumb-grid">
          {images.map((src, index) => (
            <figure key={`${src}-${index}`} className="thumb-card">
              <img src={src} alt={`Reel image ${index + 1}`} loading="lazy" />
              <figcaption>{getCardLabel(src, index)}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
