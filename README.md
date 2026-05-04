Cosmic Archive API is a tiny, star spangled API. It deals with sectors, anomalies, and mission briefs created by users. You can find its documentation on the web, crafted for public accessibility: many GET endpoints, one POST endpoint, browser docs at /docs, and a clear README file.

What it does
- Returns a list of space sectors, including names, danger levels, and stations.
- Returns a list of anomalies, containing severity, type, and relevant sectors.
- Shows how to implement an exploration feed.
- Allows users to submit their mission briefs and store them in a local JSON file.

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

Deployment process
This project ships with a deploy ready render.yaml, meaning you can deploy it instantly to Render. Connect this codebase to a GitHub repository and enjoy your live project link.

Deployment steps
1) Upload this project to your GitHub account.
2) Make a new Render app using the Blueprint feature from that repository.
3) Execute npm install and npm start.
4) Visit the browser docs page at [api docs](https://cosmic-archive-api.onrender.com/docs)

Additional info about this project
- Authentication is not necessary.
- The mission data is stored in the data/missions.runtime.json file.
- Seed data resides in the data folder.
