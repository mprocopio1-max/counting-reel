# Instagram Reel Analyzer - Frontend

Frontend React + TypeScript per inserire URL reel e visualizzare risultati dell'analisi backend.

## Features

- Input URL reel Instagram
- Submit verso backend (`POST /api/analyze`)
- Stati UI: loading, errore, successo
- Card trascrizione
- Tabella top words
- Gallery thumbnails
- Layout responsive

## Requisiti

- Node.js 20+
- npm 10+

## Setup

1. Installa dipendenze:

```bash
npm install
```

2. Crea ambiente locale:

```bash
cp .env.example .env
```

3. Configura backend URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:4000
```

4. Avvia sviluppo:

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Integrazione Backend

Il frontend si aspetta questa risposta:

```json
{
  "success": true,
  "data": {
    "transcript": "...",
    "topWords": [{ "word": "ciao", "count": 12 }],
    "thumbnails": ["/output/thumb1.jpg", "/output/thumb2.jpg"]
  }
}
```

Le thumbnail relative (`/output/...`) vengono convertite automaticamente in URL assoluti usando `VITE_API_BASE_URL`.
