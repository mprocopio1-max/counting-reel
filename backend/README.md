# Instagram Reel Analyzer - Backend

Backend API in Node.js + Express + TypeScript per analizzare un Reel Instagram a partire da URL.

## Features

- Endpoint `POST /api/analyze`
- Pipeline modulare:
  - Reel media adapter (`reelService`)
  - Estrazione audio (`audioService`)
  - Trascrizione (`transcriptionService`)
  - Analisi parole (`textAnalysisService`)
  - Estrazione thumbnail (`thumbnailService`)
- Adapter Instagram sostituibile per gestire restrizioni piattaforma
- Mock trascrizione separato per sviluppo locale
- Cartelle statiche `output` e temporanee `temp`

## Requisiti

- Node.js 20+
- npm 10+

## Setup

1. Installa dipendenze:

```bash
npm install
```

2. Crea file ambiente:

```bash
cp .env.example .env
```

3. Configura variabili principali in `.env`:

- `REEL_ADAPTER=mock`
- `SAMPLE_VIDEO_PATH=C:/path/to/local-video.mp4`
- `TRANSCRIPTION_PROVIDER=mock`

4. Avvia in sviluppo:

```bash
npm run dev
```

Server disponibile su `http://localhost:4000`.

## API

### `POST /api/analyze`

Request:

```json
{
  "url": "https://www.instagram.com/reel/ABC123/"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "transcript": "...",
    "topWords": [
      { "word": "ciao", "count": 12 }
    ],
    "thumbnails": [
      "/output/thumb-xxx-01.jpg",
      "/output/thumb-xxx-02.jpg"
    ]
  }
}
```

## Adapter Instagram

Il recupero media da Instagram e volutamente astratto in:

- `src/services/reel/reelAdapter.ts` (interfaccia)
- `src/services/reel/instagramPlaceholderReelAdapter.ts` (placeholder)

In produzione puoi implementare un adapter conforme ai termini della piattaforma senza cambiare il resto della pipeline.

## Trascrizione

Provider disponibili:

- `mock`: usa testo fittizio
- `whisper-cli`: usa comando Whisper locale

Per `whisper-cli`, imposta:

- `TRANSCRIPTION_PROVIDER=whisper-cli`
- `WHISPER_CLI_PATH=whisper`
- `WHISPER_MODEL=base`

## Build

```bash
npm run build
npm run start
```
