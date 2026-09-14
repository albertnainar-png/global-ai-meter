/* ---------------------------------------------------------------------
   Global AI Meter — application logic
   Static, dependency-free SPA. Fetches JSON/CSV data files and renders
   every section client-side via hash routing. No backend, no build step.
--------------------------------------------------------------------- */

const DATA_SOURCES = {
  countries: "data/registry/countries.json",
  sectors: "data/registry/sectors.json",
  usecases: "data/registry/usecases.json",
  meterCatalog: "data/registry/meter-catalog.csv",
  dataSources: "data/registry/data-sources.csv",
  demoMeters: "data/demo/demo-meters.json",
  realMeters: "data/real/verified-metrics.json",
};

const METERS = [
  { id: "activity", name: "AI Activity Meter", description: "Usage, model activity, AI traffic, prompts/tokens, public activity estimates." },
  { id: "adoption", name: "AI Adoption Meter", description: "Country, industry, organization, and workforce adoption; use-case adoption; adoption maturity." },
  { id: "infrastructure", name: "AI Infrastructure Meter", description: "Data centers, GPUs, compute capacity, AI chips, energy use, infrastructure investment." },
  { id: "investment", name: "AI Investment Meter", description: "Venture, corporate, and government funding — actual, announced, forecast, and estimated." },
  { id: "impact", name: "AI Impact Meter", description: "Productivity, jobs, skills, research, economic, energy/emissions, and social impact." },
];

const STATUS_LABEL = {
  Reported: "Reported",
  Calculated: "Calculated",
  Estimated: "Estimated",
  Unavailable: "Unavailable — reliable public data not found",
  Demo: "Demo data",
};

let STATE = { countries: null, sectors: null, usecases: null, catalog: null, sources: null, demo: null, loaded: false, error: null };

/* ------------------------- Utilities ------------------------- */

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatValue(record) {
  if (record.status === "Unavailable" || record.value === null || record.value === undefined) return "—";
  const n = typeof record.value === "number" ? record.value.toLocaleString("en-US") : record.value;
  return `${n}${record.unit ? " " + record.unit : ""}`;
}

function statusBadge(status) {
  const key = (status || "Unavailable").toLowerCase();
  const label = STATUS_LABEL[status] || status;
  return `<span class="badge badge--${key}">${escapeHtml(label)}</span>`;
}

/** Minimal RFC4180-ish CSV parser: handles quoted fields containing commas. */
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

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  return res.json();
}
async function fetchCSV(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  return parseCSV(await res.text());
}

function recordsFor({ meter, country, sector, continent }) {
  return STATE.metrics.filter((r) =>
    (!meter || r.meter === meter) &&
    (!country || r.country === country) &&
    (!sector || r.sector === sector) &&
    (!continent || r.continent === continent)
  );
}

function recordCard(r) {
  const cls = r.isDemo ? "demo" : (r.status || "unavailable").toLowerCase();
  return `
    <div class="record record--${cls}">
      <div class="record__head">
        <span class="record__name">${escapeHtml(r.metricName)}</span>
        <span class="record__value">${escapeHtml(formatValue(r))}</span>
      </div>
      <div>${statusBadge(r.status)} ${r.isDemo ? '<span class="badge badge--demo">Demo data</span>' : ""}</div>
      <div class="record__meta">
        ${r.geography ? `Geography: ${escapeHtml(r.geography)} · ` : ""}${r.reportingPeriod ? `Period: ${escapeHtml(r.reportingPeriod)} · ` : ""}Confidence: ${escapeHtml(r.confidence || "—")}
        ${r.sourcePublisher ? `<br/>Source: ${escapeHtml(r.sourcePublisher)}${r.sourceUrl ? ` — <a href="${escapeHtml(r.sourceUrl)}">link</a>` : ""}` : ""}
      </div>
      ${r.notes ? `<div class="record__notes">${escapeHtml(r.notes)}</div>` : ""}
    </div>`;
}

function unavailableBlock(label) {
  return `<div class="callout callout--unavailable">${escapeHtml(label)}: <strong>Unavailable — reliable public data not found.</strong></div>`;
}

function meterRecordsBlock(filter, meterId, meterLabel) {
  const recs = recordsFor({ ...filter, meter: meterId });
  if (!recs.length) return unavailableBlock(meterLabel);
  return recs.map(recordCard).join("");
}

/* ------------------------- Coverage summary (excludes demo) ------------------------- */

function computeCoverageSummary() {
  const realRecords = STATE.metrics.filter((r) => !r.isDemo);
  const demoRecords = STATE.metrics.filter((r) => r.isDemo);
  return {
    catalogMetrics: STATE.catalog.length,
    realRecords: realRecords.length,
    demoRecords: demoRecords.length,
    sourcesReviewed: STATE.sources.filter((s) => !/example/i.test(s.sourceId)).length,
    countries: STATE.countries.countries.length,
    sectors: STATE.sectors.sectors.length,
  };
}

/* ------------------------- Shell / router ------------------------- */

const routes = {
  overview: renderOverview,
  continents: renderContinents,
  countries: renderCountries,
  sectors: renderSectors,
  usecases: renderUsecases,
  sources: renderSources,
  methodology: renderMethodology,
  about: renderAbout,
};

function parseHash() {
  const hash = location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/").filter(Boolean);
  return { section: parts[0] || "overview", param: parts[1] ? decodeURIComponent(parts[1]) : null };
}

function setActiveNav(section) {
  document.querySelectorAll(".primary-nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === section);
  });
}

function router() {
  const app = document.getElementById("app");
  if (STATE.error) {
    app.innerHTML = errorView(STATE.error);
    return;
  }
  if (!STATE.loaded) return;

  const { section, param } = parseHash();
  setActiveNav(section);
  const fn = routes[section];
  app.innerHTML = fn ? fn(param) : render404();
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function errorView(err) {
  return `
    <div class="callout callout--notice">
      <h2 style="margin-top:0">Data couldn't be loaded</h2>
      <p>Global AI Meter fetches its data files at runtime, so it needs to be served over HTTP rather than opened directly as a local file.</p>
      <p>Run <code>python3 -m http.server 8080</code> from the <code>public/</code> folder (or any static file server) and open the site from that address.</p>
      <p class="muted">Technical detail: ${escapeHtml(err.message || String(err))}</p>
    </div>`;
}

function render404() {
  return `<h1>Not found</h1><p>That page doesn't exist. <a href="#/overview">Return to Overview</a>.</p>`;
}

/* ------------------------- Overview ------------------------- */

function renderOverview() {
  const c = computeCoverageSummary();
  const meterCards = METERS.map((m) => {
    const recs = recordsFor({ meter: m.id });
    const realCount = recs.filter((r) => !r.isDemo).length;
    const barWidth = Math.min(100, realCount * 20);
    return `
      <a class="meter-card" href="#/methodology">
        <h3>${escapeHtml(m.name)}</h3>
        <p>${escapeHtml(m.description)}</p>
        <div class="meter-card__bar"><span style="width:${barWidth}%"></span></div>
        <span class="muted" style="font-size:0.78rem">${realCount ? `${realCount} verified record(s) loaded` : "No verified records loaded yet"}</span>
      </a>`;
  }).join("");

  return `
    <p class="eyebrow">Public AI Intelligence Dashboard</p>
    <h1>Global AI Meter</h1>
    <p class="lede">One place to explore the world's AI activity, adoption, infrastructure, investment, and impact.</p>
    <p>Global AI Meter is an <strong>independent</strong> public-information project. It is not the official global authority for measuring AI, and it does not claim endorsement by any company, government, or organization it references. Every figure shown here carries a visible data status, so you always know whether a number is Reported, Calculated, Estimated, Demo, or honestly Unavailable.</p>

    <div class="meter-grid">${meterCards}</div>

    <h2>Global summary</h2>
    <div class="coverage">
      <div class="coverage__item"><span class="coverage__num">${c.catalogMetrics}</span><span class="coverage__label">Metrics catalogued</span></div>
      <div class="coverage__item"><span class="coverage__num">${c.realRecords}</span><span class="coverage__label">Verified real records loaded</span></div>
      <div class="coverage__item"><span class="coverage__num">${c.demoRecords}</span><span class="coverage__label">Demo records (excluded from real totals)</span></div>
      <div class="coverage__item"><span class="coverage__num">${c.countries}</span><span class="coverage__label">Countries in directory</span></div>
      <div class="coverage__item"><span class="coverage__num">${c.sectors}</span><span class="coverage__label">Sectors tracked</span></div>
    </div>

    <h2>Data coverage</h2>
    <p>This build ships with a small set of real, sourced global figures — drawn from Stanford HAI's AI Index, McKinsey's State of AI survey, the IEA's Energy and AI research, and an open-access research paper — each with full source and confidence metadata. Coverage is intentionally global-only and thin so far: almost every country, sector, and use-case slot still reads "Unavailable," because a verified public figure at that level of granularity hasn't been added yet. See the <a href="#/sources">Sources</a> page for citations and the project README for how to add more.</p>

    <h2>Explore</h2>
    <div class="dir-grid">
      <a class="dir-card" href="#/continents"><span class="dir-card__name">Continents</span><span class="dir-card__meta">6 regions</span></a>
      <a class="dir-card" href="#/countries"><span class="dir-card__name">Countries</span><span class="dir-card__meta">${c.countries} in directory</span></a>
      <a class="dir-card" href="#/sectors"><span class="dir-card__name">Sectors</span><span class="dir-card__meta">${c.sectors} sectors</span></a>
      <a class="dir-card" href="#/usecases"><span class="dir-card__name">AI use cases</span><span class="dir-card__meta">${STATE.usecases.usecases.length} categories</span></a>
      <a class="dir-card" href="#/sources"><span class="dir-card__name">Sources</span><span class="dir-card__meta">Source registry</span></a>
      <a class="dir-card" href="#/methodology"><span class="dir-card__name">Methodology</span><span class="dir-card__meta">How this is measured</span></a>
    </div>`;
}

/* ------------------------- Continents ------------------------- */

function renderContinents(param) {
  if (param) return renderContinentDetail(param);
  const continents = STATE.countries.continents;
  const cards = continents.map((name) => {
    const count = STATE.countries.countries.filter((c) => c.continent === name).length;
    return `<a class="dir-card" href="#/continents/${encodeURIComponent(name)}"><span class="dir-card__name">${escapeHtml(name)}</span><span class="dir-card__meta">${count} countries in directory</span></a>`;
  }).join("");
  return `
    <p class="eyebrow">Continents</p>
    <h1>Continents</h1>
    <p>Six regions. Each continent page summarizes meter coverage across its countries and lists known data gaps. No continent-level statistics are invented — figures shown are either sourced records or explicitly marked Unavailable.</p>
    <div class="dir-grid">${cards}</div>`;
}

function renderContinentDetail(name) {
  const countries = STATE.countries.countries.filter((c) => c.continent === name);
  if (!countries.length) return render404();
  const meterSummaries = METERS.map((m) => {
    const recs = recordsFor({ meter: m.id, continent: name });
    return `<div class="dir-card"><span class="dir-card__name">${escapeHtml(m.name)}</span><span class="dir-card__meta">${recs.length ? `${recs.length} record(s), incl. demo` : "Unavailable — reliable public data not found"}</span></div>`;
  }).join("");
  const countryList = countries.map((c) => `<a class="dir-card" href="#/countries/${c.iso}"><span class="dir-card__name">${escapeHtml(c.name)}</span><span class="dir-card__meta">${c.iso}</span></a>`).join("");

  return `
    <p class="crumb"><a href="#/continents">Continents</a> / ${escapeHtml(name)}</p>
    <h1>${escapeHtml(name)}</h1>
    <h2>Meter summaries</h2>
    <div class="dir-grid">${meterSummaries}</div>
    <h2>Countries (${countries.length})</h2>
    <div class="dir-grid">${countryList}</div>
    <h2>Data gaps</h2>
    <p>Most metric/country combinations in ${escapeHtml(name)} do not yet have a verified public source in this build. They display as Unavailable rather than being omitted or estimated without basis.</p>`;
}

/* ------------------------- Countries ------------------------- */

function renderCountries(param) {
  if (param) return renderCountryDetail(param);
  const byContinent = {};
  STATE.countries.countries.forEach((c) => {
    (byContinent[c.continent] ||= []).push(c);
  });
  const sections = Object.entries(byContinent).map(([continent, list]) => `
    <h3>${escapeHtml(continent)}</h3>
    <div class="dir-grid">
      ${list.map((c) => `<a class="dir-card" href="#/countries/${c.iso}"><span class="dir-card__name">${escapeHtml(c.name)}</span><span class="dir-card__meta">${c.iso}</span></a>`).join("")}
    </div>`).join("");

  return `
    <p class="eyebrow">Country directory</p>
    <h1>Countries</h1>
    <p>A directory structure built to eventually support every country. Selecting a country shows its AI Activity, Adoption, Infrastructure, Investment, and Impact records — or "Unavailable" where no verified public source exists yet.</p>
    <input class="controls" id="country-search" type="search" placeholder="Filter countries…" style="width:100%;max-width:320px;padding:0.5em 0.7em;border:1px solid var(--line-strong);border-radius:3px;margin-bottom:1em" />
    <div id="country-sections">${sections}</div>`;
}

function renderCountryDetail(iso) {
  const country = STATE.countries.countries.find((c) => c.iso === iso.toUpperCase());
  if (!country) return render404();
  const meterBlocks = METERS.map((m) => `
    <h3>${escapeHtml(m.name)}</h3>
    ${meterRecordsBlock({ country: country.iso }, m.id, m.name)}`).join("");

  return `
    <p class="crumb"><a href="#/countries">Countries</a> / <a href="#/continents/${encodeURIComponent(country.continent)}">${escapeHtml(country.continent)}</a> / ${escapeHtml(country.name)}</p>
    <h1>${escapeHtml(country.name)}</h1>
    <p class="muted">ISO: ${escapeHtml(country.iso)} · Continent: ${escapeHtml(country.continent)}</p>
    ${meterBlocks}
    <h2>Data gaps</h2>
    <p>Any meter above showing "Unavailable" has no verified public source for ${escapeHtml(country.name)} in this build yet. See the README for how to add sourced data for a country.</p>`;
}

/* ------------------------- Sectors ------------------------- */

function renderSectors(param) {
  if (param) return renderSectorDetail(param);
  const cards = STATE.sectors.sectors.map((s) => `<a class="dir-card" href="#/sectors/${s.id}"><span class="dir-card__name">${escapeHtml(s.name)}</span></a>`).join("");
  return `
    <p class="eyebrow">Sectors</p>
    <h1>Sectors</h1>
    <p>Seventeen sectors tracked for AI use cases, adoption, infrastructure, investment, and impact evidence.</p>
    <div class="dir-grid">${cards}</div>`;
}

function renderSectorDetail(id) {
  const sector = STATE.sectors.sectors.find((s) => s.id === id);
  if (!sector) return render404();
  const meterBlocks = METERS.map((m) => `
    <h3>${escapeHtml(m.name)}</h3>
    ${meterRecordsBlock({ sector: sector.id }, m.id, m.name)}`).join("");
  return `
    <p class="crumb"><a href="#/sectors">Sectors</a> / ${escapeHtml(sector.name)}</p>
    <h1>${escapeHtml(sector.name)}</h1>
    <h2>Evidence by meter</h2>
    ${meterBlocks}
    <h2>Data gaps</h2>
    <p>Meters above showing "Unavailable" have no verified public source for ${escapeHtml(sector.name)} in this build yet.</p>`;
}

/* ------------------------- Use cases ------------------------- */

function renderUsecases() {
  const cards = STATE.usecases.usecases.map((u) => `
    <div class="dir-card">
      <span class="dir-card__name">${escapeHtml(u.name)}</span>
      <span class="dir-card__meta">${escapeHtml(u.description)}</span>
      <div style="margin-top:0.5em">${unavailableBlock("Verified adoption data")}</div>
    </div>`).join("");
  return `
    <p class="eyebrow">AI use cases</p>
    <h1>AI use cases</h1>
    <p>These are category definitions only. Per the project's data rules, a use case is shown with real adoption figures only once a verified public source is attached — until then it remains a category.</p>
    <div class="dir-grid">${cards}</div>`;
}

/* ------------------------- Sources ------------------------- */

function renderSources() {
  const rows = STATE.sources.map((s) => `
    <tr>
      <td>${escapeHtml(s.sourceId)}</td>
      <td>${escapeHtml(s.publisher)}</td>
      <td>${escapeHtml(s.sourceTitle)}</td>
      <td>${s.url ? `<a href="${escapeHtml(s.url)}">link</a>` : "—"}</td>
      <td>${escapeHtml(s.publicationDate)}</td>
      <td>${escapeHtml(s.licenseBasis)}</td>
      <td>${escapeHtml(s.confidence)}</td>
    </tr>`).join("");

  return `
    <p class="eyebrow">Source registry</p>
    <h1>Sources</h1>
    <p>Every real metric on Global AI Meter must cite a row in this registry. This build ships with a template row only — see <code>docs/SOURCE_REVIEW_POLICY.md</code> for how a new source is reviewed and added.</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Source ID</th><th>Publisher</th><th>Title</th><th>URL</th><th>Published</th><th>License / reuse basis</th><th>Confidence</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="muted">Full fields recorded per source: Source ID, Publisher, Source title, URL, Publication date, Reporting period, License/reuse basis, Access date, Source type, Related meter, Related geography, Related sector, Confidence, Notes.</p>`;
}

/* ------------------------- Methodology ------------------------- */

function renderMethodology() {
  return `
    <p class="eyebrow">Methodology</p>
    <h1>Methodology</h1>

    <h2>What each meter measures</h2>
    <div class="dir-grid">
      ${METERS.map((m) => `<div class="dir-card"><span class="dir-card__name">${escapeHtml(m.name)}</span><span class="dir-card__meta">${escapeHtml(m.description)}</span></div>`).join("")}
    </div>

    <h2>Data statuses</h2>
    <table>
      <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
      <tbody>
        <tr><td>${statusBadge("Reported")}</td><td>Taken directly from a named publisher's published figure, with a source URL.</td></tr>
        <tr><td>${statusBadge("Calculated")}</td><td>Derived from one or more Reported figures using a documented calculation method.</td></tr>
        <tr><td>${statusBadge("Estimated")}</td><td>A publisher's own modeled/estimated figure, or a documented estimation method.</td></tr>
        <tr><td>${statusBadge("Unavailable")}</td><td>No reliable public source could be found. Never left blank, never guessed at.</td></tr>
        <tr><td>${statusBadge("Demo")}</td><td>Illustrative placeholder used only to exercise the interface. Never a real statistic.</td></tr>
      </tbody>
    </table>

    <h2>How calculations are performed</h2>
    <p>A Calculated record's <code>calculationMethod</code> field documents the exact formula and its input records. Estimated records document the estimation method in the same field. Both are required — a record cannot be Calculated or Estimated without stating how.</p>

    <h2>How sources are reviewed</h2>
    <p>Every source is checked for public access, a named publisher, a documented license or reuse basis, and a recorded publication date before it may be cited. Full process: <code>docs/SOURCE_REVIEW_POLICY.md</code>.</p>

    <h2>How conflicting sources are handled</h2>
    <p>Both figures are kept as separate records with a note pointing to the other, rather than being averaged or one being silently discarded.</p>

    <h2>How missing data is displayed</h2>
    <p>As "Unavailable — reliable public data not found," visibly, everywhere a real figure would otherwise appear.</p>

    <h2>How updates are recorded</h2>
    <p>Each edit updates the access date, notes any change in value or source, and bumps the data file's <code>lastUpdated</code> field.</p>

    <h2>How licensing is reviewed</h2>
    <p>Every source's license or reuse basis is recorded at the time it's added, and the project's own MIT code license is never treated as covering third-party data.</p>

    <h2>How confidence is assigned</h2>
    <p><strong>High</strong> — a single authoritative primary source with disclosed methodology. <strong>Medium</strong> — credible but partially disclosed or secondary. <strong>Low</strong> — plausible but weakly sourced or self-reported, with a caveat in notes.</p>

    <p class="muted">Full specification: see <code>docs/MASTER_SPECIFICATION.md</code>, <code>docs/DATA_POLICY.md</code>, and <code>docs/METER_DEFINITIONS.md</code> in the project repository.</p>`;
}

/* ------------------------- About ------------------------- */

function renderAbout() {
  return `
    <p class="eyebrow">About</p>
    <h1>About Global AI Meter</h1>
    <p class="lede">Numbers about AI circulate constantly, often without their source, date, or method attached. Global AI Meter's job is narrow: collect only public, legally reusable information, attach full source and method metadata to every figure, and say "Unavailable" out loud whenever a real number can't be verified.</p>

    <h2>Why it exists</h2>
    <p>To make public information about AI easier to discover, compare, and cite in one place — across countries, sectors, and use cases — without requiring anyone to track down a dozen scattered reports.</p>

    <h2>Independence</h2>
    <p>Global AI Meter is not the official global authority for measuring AI, and it is not affiliated with, endorsed by, or representing any company, government, or organization it references. It uses no third-party logos or trademarks.</p>

    <h2>The public-data approach</h2>
    <p>Only publicly accessible, legally reusable sources are used. No confidential, personal, employee, or client data; no paywalled or login-only sources; no paid APIs or subscriptions; no scraping in violation of a site's terms. Full policy: <code>docs/DATA_POLICY.md</code>.</p>

    <h2>Limitations of global AI measurement</h2>
    <p>Much of what would be useful to know about global AI activity, adoption, infrastructure, investment, and impact is simply not publicly disclosed anywhere, by anyone. "Unavailable" is an expected, honest, and common result here — not a bug to be hidden. This build ships with a handful of real, global, well-sourced figures rather than country- or sector-level detail, because that is what could be verified against the data policy in the time available — see the project README for how to extend coverage.</p>`;
}

/* ------------------------- Boot ------------------------- */

async function boot() {
  try {
    const [countries, sectors, usecases, catalog, sources, demo, real] = await Promise.all([
      fetchJSON(DATA_SOURCES.countries),
      fetchJSON(DATA_SOURCES.sectors),
      fetchJSON(DATA_SOURCES.usecases),
      fetchCSV(DATA_SOURCES.meterCatalog),
      fetchCSV(DATA_SOURCES.dataSources),
      fetchJSON(DATA_SOURCES.demoMeters),
      fetchJSON(DATA_SOURCES.realMeters),
    ]);
    const metrics = [...(real.records || []), ...(demo.records || [])];
    const lastUpdated = [demo.lastUpdated, real.lastUpdated].filter(Boolean).sort().pop();
    STATE = { countries, sectors, usecases, catalog, sources, demo, real, metrics, loaded: true, error: null };

    const hasDemo = metrics.some((r) => r.isDemo);
    document.getElementById("demo-banner").hidden = !hasDemo;
    document.getElementById("footer-updated").textContent = `Last updated: ${lastUpdated || "—"}`;
  } catch (err) {
    STATE.error = err;
  }
  router();
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", () => {
  boot();

  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("primary-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  document.getElementById("app").addEventListener("input", (e) => {
    if (e.target.id !== "country-search") return;
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll("#country-sections .dir-card").forEach((card) => {
      const name = card.querySelector(".dir-card__name").textContent.toLowerCase();
      card.style.display = name.includes(q) ? "" : "none";
    });
  });
});
