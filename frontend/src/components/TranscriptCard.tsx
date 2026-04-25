interface TranscriptCardProps {
  transcript: string;
}

export function TranscriptCard({ transcript }: TranscriptCardProps): JSX.Element {
  return (
    <section className="panel transcript-panel">
      <h2>Transcript</h2>
      <p>{transcript}</p>
    </section>
  );
}
