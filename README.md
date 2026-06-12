The Cosmic Archive API is a small, open source API that manages sectors, anomalies and mission briefs. Its documentation is publicly accessible on the web. It includes many GET endpoints, one POST endpoint, browser documentation at /docs and a clear README file.

What it does
- Returns a list of space sectors, including names, danger levels, and stations.
- Returns a list of anomalies, containing severity, type, and relevant sectors.
- Shows how to implement an exploration feed.
- Allows users to submit their mission briefs and store them in a local JSON file.

docs:
https://cosmic-archive-api.onrender.com/docs

Endpoints
- GET /api/health
- GET /api/sectors
- GET /api/sectors/:id
- GET /api/anomalies
- GET /api/feed
- GET /api/missions
- POST /api/missions
- GET /docs

Documentation comes with examples of curl and can be accessed via /docs.

Local setup
Needs Node v20 or above.

npm install
npm start

And then access:
http://localhost:3000/docs

Example queries
curl http://localhost:3000/api/health
curl "http://localhost:3000/api/sectors?dangerLevel=high"
curl "http://localhost:3000/api/anomalies?type=signal&minSeverity=4"
curl -X POST http://localhost:3000/api/missions \
  -H "Content Type: application/json" \
  -d '{
    "captain": "Mira Keene",
    "sectorId": "ember null",
    "objective": "Capture thermal readings inside Ember Mouth"
  }'


Additional info about this project
- Authentication is not necessary.
- The mission data is stored in the data/missions.runtime.json file.
- Seed data resides in the data folder.
