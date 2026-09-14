#!/usr/bin/env node
/**
 * Global AI Meter — data validation test suite.
 * Zero dependencies. Run with: node tests/meter-validation.test.js
 *
 * Validates every rule listed in docs/DATA_POLICY.md §5 against the
 * registry and demo data files. Exits non-zero and prints every
 * violation if any check fails.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const METERS = ["activity", "adoption", "infrastructure", "investment", "impact"];
const STATUSES = ["Reported", "Calculated", "Estimated", "Unavailable", "Demo"];
const CONFIDENCE = ["High", "Medium", "Low"];

let failures = [];
let checks = 0;

function fail(msg) { failures.push(msg); }
function check(label, fn) {
  checks++;
  try {
    fn();
  } catch (e) {
    fail(`[${label}] threw: ${e.message}`);
  }
}

/** Minimal CSV parser matching public/app.js's behavior (handles quoted fields). */
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else { field += c; }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, idx) => [h, r[idx] ?? ""])));
}

function readJSON(rel) { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8")); }
function readCSV(rel) { return parseCSV(fs.readFileSync(path.join(ROOT, rel), "utf8")); }

// ---- Load data --------------------------------------------------------
const catalog = readCSV("public/data/registry/meter-catalog.csv");
const sources = readCSV("public/data/registry/data-sources.csv");
const countries = readJSON("public/data/registry/countries.json");
const sectors = readJSON("public/data/registry/sectors.json");
const usecases = readJSON("public/data/registry/usecases.json");
const demo = readJSON("public/data/demo/demo-meters.json");
const real = readJSON("public/data/real/verified-metrics.json");
const allMetricRecords = [...demo.records, ...real.records];

// ---- File existence -----------------------------------------------------
check("required files exist", () => {
  const required = [
    "README.md", "LICENSE", ".gitignore", "package.json",
    "docs/MASTER_SPECIFICATION.md", "docs/DATA_POLICY.md",
    "docs/METER_DEFINITIONS.md", "docs/SOURCE_REVIEW_POLICY.md",
    "public/data/registry/data-sources.csv", "public/data/registry/meter-catalog.csv",
    "public/data/demo/demo-meters.json", "public/data/real/verified-metrics.json",
    "public/index.html", "public/styles.css", "public/app.js",
  ];
  for (const rel of required) {
    if (!fs.existsSync(path.join(ROOT, rel))) fail(`Missing required file: ${rel}`);
  }
});

// ---- Meter catalog --------------------------------------------------------
check("meter catalog: required fields + valid meter + unique metricId", () => {
  const seen = new Set();
  for (const row of catalog) {
    if (!row.metricId) fail(`catalog row missing metricId: ${JSON.stringify(row)}`);
    if (!row.metricName) fail(`catalog row ${row.metricId} missing metricName`);
    if (!row.unit) fail(`catalog row ${row.metricId} missing unit`);
    if (!METERS.includes(row.meter)) fail(`catalog row ${row.metricId} has invalid meter category: ${row.meter}`);
    if (seen.has(row.metricId)) fail(`duplicate metricId in catalog: ${row.metricId}`);
    seen.add(row.metricId);
  }
  if (catalog.length === 0) fail("meter catalog is empty");
});

// ---- Source registry --------------------------------------------------------
check("source registry: required fields + unique sourceId + valid confidence", () => {
  const seen = new Set();
  for (const row of sources) {
    if (!row.sourceId) fail(`source row missing sourceId: ${JSON.stringify(row)}`);
    if (!row.publisher) fail(`source ${row.sourceId} missing publisher`);
    if (!row.sourceTitle) fail(`source ${row.sourceId} missing sourceTitle`);
    if (!row.url) fail(`source ${row.sourceId} missing url`);
    if (!row.licenseBasis) fail(`source ${row.sourceId} missing licenseBasis`);
    if (!row.accessDate) fail(`source ${row.sourceId} missing accessDate`);
    if (row.confidence && !CONFIDENCE.includes(row.confidence)) fail(`source ${row.sourceId} has invalid confidence: ${row.confidence}`);
    if (seen.has(row.sourceId)) fail(`duplicate sourceId in registry: ${row.sourceId}`);
    seen.add(row.sourceId);
  }
});

// ---- Reference registries (structural, not statistics) --------------------------------------------------------
check("countries registry: unique ISO codes, valid continent", () => {
  const seen = new Set();
  const validContinents = new Set(countries.continents);
  for (const c of countries.countries) {
    if (!c.iso || !c.name || !c.continent) fail(`country entry missing a field: ${JSON.stringify(c)}`);
    if (!validContinents.has(c.continent)) fail(`country ${c.iso} has unlisted continent: ${c.continent}`);
    if (seen.has(c.iso)) fail(`duplicate country ISO code: ${c.iso}`);
    seen.add(c.iso);
  }
});

check("sectors registry: unique ids", () => {
  const seen = new Set();
  for (const s of sectors.sectors) {
    if (!s.id || !s.name) fail(`sector entry missing a field: ${JSON.stringify(s)}`);
    if (seen.has(s.id)) fail(`duplicate sector id: ${s.id}`);
    seen.add(s.id);
  }
});

check("usecases registry: unique ids", () => {
  const seen = new Set();
  for (const u of usecases.usecases) {
    if (!u.id || !u.name) fail(`usecase entry missing a field: ${JSON.stringify(u)}`);
    if (seen.has(u.id)) fail(`duplicate usecase id: ${u.id}`);
    seen.add(u.id);
  }
});

// ---- Demo / metric records --------------------------------------------------------
check("metric records: full field + status + demo-flag validation", () => {
  const seen = new Set();
  for (const r of allMetricRecords) {
    const ctx = r.metricId || JSON.stringify(r);

    if (!r.metricId) fail(`record missing metricId: ${ctx}`);
    if (!r.metricName) fail(`record ${ctx} missing metricName`);
    if (!METERS.includes(r.meter)) fail(`record ${ctx} has invalid meter category: ${r.meter}`);
    if (!r.reportingPeriod) fail(`record ${ctx} missing reportingPeriod`);
    if (!STATUSES.includes(r.status)) fail(`record ${ctx} has invalid/missing data status: ${r.status}`);
    if (!r.confidence || !CONFIDENCE.includes(r.confidence)) fail(`record ${ctx} has invalid/missing confidence: ${r.confidence}`);

    // Demo flag and status must agree in both directions.
    if (r.isDemo === true && r.status !== "Demo") fail(`record ${ctx} has isDemo:true but status is "${r.status}" (demo data presented as verified)`);
    if (r.status === "Demo" && r.isDemo !== true) fail(`record ${ctx} has status "Demo" but isDemo is not true`);

    // Real (non-demo, non-unavailable) records need full source/license metadata.
    if (["Reported", "Calculated", "Estimated"].includes(r.status)) {
      if (!r.sourceUrl) fail(`record ${ctx} (${r.status}) missing sourceUrl`);
      if (!r.sourcePublisher) fail(`record ${ctx} (${r.status}) missing sourcePublisher`);
      if (!r.licenseBasis) fail(`record ${ctx} (${r.status}) missing licenseBasis`);
    }
    if (r.status === "Calculated" && !r.calculationMethod) fail(`record ${ctx} is Calculated but missing calculationMethod`);
    if (r.status === "Estimated" && !r.calculationMethod) fail(`record ${ctx} is Estimated but missing an estimation method (calculationMethod)`);

    // Negative values are not meaningful for this catalog's units (counts, %, USD, etc.).
    if (typeof r.value === "number" && r.value < 0) fail(`record ${ctx} has an unsupported negative value: ${r.value}`);

    if (seen.has(r.metricId)) fail(`duplicate metricId among metric records: ${r.metricId}`);
    seen.add(r.metricId);
  }
});

// ---- Report --------------------------------------------------------
console.log(`Global AI Meter — validation suite`);
console.log(`Ran ${checks} check group(s) across ${catalog.length} catalog metrics, ${sources.length} sources, ${allMetricRecords.length} metric records (${real.records.length} real, ${demo.records.length} demo).\n`);

if (failures.length) {
  console.error(`FAILED — ${failures.length} issue(s) found:\n`);
  failures.forEach((f) => console.error(`  ✗ ${f}`));
  process.exitCode = 1;
} else {
  console.log("PASSED — no validation issues found.");
}
