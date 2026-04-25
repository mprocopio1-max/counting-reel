import { FormEvent } from "react";

interface UrlFormProps {
  url: string;
  onUrlChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function UrlForm({ url, onUrlChange, onSubmit, loading }: UrlFormProps): JSX.Element {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="url-form" onSubmit={handleSubmit}>
      <label htmlFor="reel-url" className="field-label">
        Instagram Reel URL
      </label>
      <div className="input-row">
        <input
          id="reel-url"
          type="url"
          inputMode="url"
          placeholder="https://www.instagram.com/reel/..."
          value={url}
          onChange={(event) => onUrlChange(event.target.value)}
          required
          disabled={loading}
          className="url-input"
        />
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
    </form>
  );
}
