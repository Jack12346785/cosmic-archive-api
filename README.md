# Cosmic Archive API

Cosmic Archive API is a small sci fi API for sectors, anomalies, and custom mission briefs, all accessible via web documentation and designed with public friendly project requirements in mind, such as multiple GET endpoints, a POST endpoint, browser docs located at `/docs`, and a README.

## What it does

- Provides a list of named space sectors and their dangers and stations.
- Provides a list of anomalies, with filters for severity, anomaly types, and space sectors.
- Generates a mixed exploration feed for demonstration purposes.
- Takes mission briefs submitted by users and stores them in a local JSON file.

## Endpoints

- `GET /api/health`
- `GET /api/sectors`
- `GET /api/sectors/:id`
- `GET /api/anomalies`
- `GET /api/feed`
- `GET /api/missions`
- `POST /api/missions`
- `GET /docs`

The documentation includes examples of `curl` commands and can be found at `/docs`.

## Running locally

The project requires Node 20 or later.

```bash
npm install
npm start
```

Afterwards, access the following URL:

- `http://localhost:3000/docs`

## Sample requests

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

There is a `render.yaml` file provided, which allows you to deploy this project quickly on Render. After connecting to your GitHub repository, you will receive a public link.

Deployment steps:

1. Commit this folder to a GitHub repository.
2. Create a new deployment using the Render Blueprint from the repository.
3. Build the app with `npm install` and run with `npm start`.
4. Your API documentation will now be live on `https://<your-service>.onrender.com/docs`.

## Additional notes

- No authentication is required.
- Mission information is saved to `data/missions.runtime.json`.
- Seed data exists in the `data/` directory and can be easily expanded.
