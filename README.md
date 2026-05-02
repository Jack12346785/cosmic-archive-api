# Cosmic Archive API

Cosmic Archive API is a small public-friendly sci-fi API for sectors, anomalies, and custom mission briefs. It is designed to satisfy project submission requirements cleanly: multiple `GET` endpoints, a `POST` endpoint, browser docs at `/docs`, and a hand-written README.

## What it does

- Lists named space sectors with danger ratings and station data.
- Lists anomalies with filters for severity, type, and sector.
- Returns a mixed exploration feed for quick demos.
- Accepts user-created mission briefs and stores them in a local JSON file.

## Endpoints

- `GET /api/health`
- `GET /api/sectors`
- `GET /api/sectors/:id`
- `GET /api/anomalies`
- `GET /api/feed`
- `GET /api/missions`
- `POST /api/missions`
- `GET /docs`

Docs include example `curl` requests and are available at `/docs`.

## Local run

This project expects Node 20+.

```bash
npm install
npm start
```

Then open:

- `http://localhost:3000/docs`

## Example requests

```bash
curl http://localhost:3000/api/health
curl "http://localhost:3000/api/sectors?dangerLevel=high"
curl "http://localhost:3000/api/anomalies?type=signal&minSeverity=4"
curl -X POST http://localhost:3000/api/missions \
  -H "Content-Type: application/json" \
  -d '{
    "captain": "Mira Keene",
    "sectorId": "ember-null",
    "objective": "Capture thermal readings inside Ember Mouth"
  }'
```

## Deployment

A `render.yaml` file is included for quick deployment to Render, which provides a stable public URL once connected to a GitHub repository.

Suggested flow:

1. Push this folder to a public GitHub repository.
2. Create a new Render Blueprint deployment from that repo.
3. Render will build with `npm install` and run with `npm start`.
4. Your API docs will then be publicly available at `https://<your-service>.onrender.com/docs`.

## Notes

- Auth is not required.
- Mission data is persisted to `data/missions.runtime.json`.
- Seed data lives in `data/` and can be extended easily.
