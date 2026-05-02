const express = require("express");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 3000);
const dataDir = path.join(__dirname, "data");
const sectorsPath = path.join(dataDir, "sectors.json");
const anomaliesPath = path.join(dataDir, "anomalies.json");
const seedMissionsPath = path.join(dataDir, "missions.seed.json");
const runtimeMissionsPath = path.join(dataDir, "missions.runtime.json");

const app = express();
const routeManifest = [
  "GET /docs",
  "GET /api/health",
  "GET /api/sectors",
  "GET /api/sectors/:id",
  "GET /api/anomalies",
  "GET /api/feed",
  "GET /api/missions",
  "POST /api/missions"
];

app.use(express.json());

app.get("/", (_req, res) => {
  res.redirect("/docs");
});

app.get("/docs", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "docs.html"));
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "cosmic-archive-api",
    routes: routeManifest,
    timestamp: new Date().toISOString()
  });
});

app.get("/api/routes", (_req, res) => {
  res.json({ routes: routeManifest });
});

app.get("/api/sectors", (req, res) => {
  const sectors = readJson(sectorsPath);
  const dangerLevel = normalizeOptionalString(req.query.dangerLevel);
  const filtered = dangerLevel
    ? sectors.filter((sector) => sector.dangerLevel === dangerLevel)
    : sectors;

  res.json({ sectors: filtered, total: filtered.length });
});

app.get("/api/sectors/:id", (req, res) => {
  const sectors = readJson(sectorsPath);
  const anomalies = readJson(anomaliesPath);
  const missions = readAllMissions();
  const sector = sectors.find((item) => item.id === req.params.id);

  if (!sector) {
    return res.status(404).json({ error: `Unknown sector: ${req.params.id}` });
  }

  const relatedAnomalies = anomalies.filter((item) => item.sectorId === sector.id);
  const missionCount = missions.filter((item) => item.sectorId === sector.id).length;

  res.json({
    sector,
    anomalies: relatedAnomalies,
    missionCount
  });
});

app.get("/api/anomalies", (req, res) => {
  const anomalies = readJson(anomaliesPath);
  const sectorId = normalizeOptionalString(req.query.sectorId);
  const type = normalizeOptionalString(req.query.type);
  const minSeverity = Number(req.query.minSeverity || 0);

  const filtered = anomalies.filter((item) => {
    if (sectorId && item.sectorId !== sectorId) {
      return false;
    }

    if (type && item.type !== type) {
      return false;
    }

    if (Number.isFinite(minSeverity) && minSeverity > 0 && item.severity < minSeverity) {
      return false;
    }

    return true;
  });

  res.json({ anomalies: filtered, total: filtered.length });
});

app.get("/api/feed", (req, res) => {
  const count = clampNumber(Number(req.query.count || 6), 1, 20);
  const anomalies = readJson(anomaliesPath).map((item) => ({
    kind: "anomaly",
    headline: `${item.name} detected`,
    detail: item.description,
    sectorId: item.sectorId,
    severity: item.severity
  }));
  const missions = readAllMissions().map((item) => ({
    kind: "mission",
    headline: `${item.callsign} assigned`,
    detail: item.objective,
    sectorId: item.sectorId,
    severity: item.riskBudget
  }));

  const items = [...anomalies, ...missions]
    .sort((left, right) => right.severity - left.severity)
    .slice(0, count);

  res.json({ items, total: items.length });
});

app.get("/api/missions", (_req, res) => {
  const missions = readAllMissions()
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  res.json({ missions, total: missions.length });
});

app.post("/api/missions", (req, res) => {
  try {
    const captain = requiredString(req.body?.captain, "captain");
    const sectorId = requiredString(req.body?.sectorId, "sectorId");
    const objective = requiredString(req.body?.objective, "objective");
    const shipClass = normalizeOptionalString(req.body?.shipClass) || "utility";
    const riskBudget = clampNumber(Number(req.body?.riskBudget || 3), 1, 5);

    const sectors = readJson(sectorsPath);
    const sectorExists = sectors.some((item) => item.id === sectorId);
    if (!sectorExists) {
      return res.status(400).json({ error: `Unknown sectorId: ${sectorId}` });
    }

    const mission = {
      id: createId(),
      callsign: generateCallsign(sectorId),
      captain,
      sectorId,
      objective,
      shipClass,
      status: "briefing",
      riskBudget,
      createdAt: new Date().toISOString()
    };

    const runtimeMissions = readRuntimeMissions();
    runtimeMissions.unshift(mission);
    writeJson(runtimeMissionsPath, runtimeMissions);

    return res.status(201).json({ mission });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.use((err, _req, res, _next) => {
  res.status(500).json({
    error: "Internal server error",
    detail: err.message
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Cosmic Archive API listening on http://localhost:${port}`);
  });
}

module.exports = { app };

function readAllMissions() {
  return [...readJson(seedMissionsPath), ...readRuntimeMissions()];
}

function readRuntimeMissions() {
  if (!fs.existsSync(runtimeMissionsPath)) {
    return [];
  }

  return readJson(runtimeMissionsPath);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function normalizeOptionalString(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function requiredString(value, field) {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!normalized) {
    throw new Error(`Missing required field: ${field}`);
  }

  return normalized;
}

function clampNumber(value, minimum, maximum) {
  if (!Number.isFinite(value)) {
    return minimum;
  }

  return Math.min(Math.max(value, minimum), maximum);
}

function createId() {
  return `msn_${Math.random().toString(36).slice(2, 10)}`;
}

function generateCallsign(sectorId) {
  const prefix = sectorId.split("-")[0].slice(0, 5).toUpperCase();
  const suffix = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${suffix}`;
}
