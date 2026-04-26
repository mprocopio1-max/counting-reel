import { ChangeEvent, DragEvent, useRef, useState } from "react";

interface UploadFormProps {
  onSubmitFile: (file: File) => void;
  loading: boolean;
}

const acceptedVideoTypes = ["video/mp4", "video/quicktime", "video/webm", "video/x-matroska"];

export function UploadForm({ onSubmitFile, loading }: UploadFormProps): JSX.Element {
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateSelectedFile = (file: File | null): void => {
    if (!file) {
      setSelectedFileName("");
      return;
    }

    setSelectedFileName(file.name);
  };

  const handleFiles = (fileList: FileList | null): void => {
    if (!fileList || fileList.length === 0) {
      return;
    }

    const file = fileList[0];
    updateSelectedFile(file);
    onSubmitFile(file);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    handleFiles(event.target.files);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <section className="upload-section">
      <p className="upload-title">Or upload a local video</p>
      <div
        className={`drop-zone ${isDragging ? "dragging" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <p>Drag and drop a video here, or click to select.</p>
        <p className="drop-zone-hint">Max size: 100MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={acceptedVideoTypes.join(",")}
          className="hidden-input"
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      {selectedFileName ? <p className="selected-file">Selected: {selectedFileName}</p> : null}
    </section>
  );
}
