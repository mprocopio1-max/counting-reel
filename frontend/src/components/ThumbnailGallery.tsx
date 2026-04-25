interface ThumbnailGalleryProps {
  images: string[];
}

export function ThumbnailGallery({ images }: ThumbnailGalleryProps): JSX.Element {
  return (
    <section className="panel">
      <h2>Thumbnails</h2>
      {images.length === 0 ? (
        <p className="empty-state">No thumbnails available.</p>
      ) : (
        <div className="thumb-grid">
          {images.map((src, index) => (
            <figure key={`${src}-${index}`} className="thumb-card">
              <img src={src} alt={`Reel frame ${index + 1}`} loading="lazy" />
              <figcaption>Frame {index + 1}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
