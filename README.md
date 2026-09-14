# Global AI Meter

**One place to explore the world's AI activity, adoption, infrastructure, investment, and impact.**

Global AI Meter is an independent, public-information dashboard. It is **not** an official
authority on global AI measurement, and it is **not** affiliated with, endorsed by, or
representing any company, government, or organization. It exists to make publicly available
information about AI easier to find, compare, and cite in one place — and to be honest, loudly
and by default, about what is actually known versus what is missing.

---

## Why it exists

There is no single, neutral, publicly-reusable index of how AI is actually being built, adopted,
funded, and felt around the world. Numbers about AI circulate constantly, often without their
source, their date, or their method attached. Global AI Meter's job is narrow: collect **only**
information that is public and legally reusable, attach full source and method metadata to every
figure, and say "Unavailable" out loud whenever a real, verifiable number can't be found — rather
than quietly filling the gap with something that looks like data.

## The five meters

| Meter | What it measures |
|---|---|
| **AI Activity** | Usage, model activity, AI traffic, prompts/tokens, public activity estimates |
| **AI Adoption** | Country, industry, organization, and workforce adoption; use-case adoption; adoption maturity |
| **AI Infrastructure** | Data centers, GPUs/chips, compute capacity, energy use, infrastructure investment |
| **AI Investment** | Venture, corporate, and government funding — clearly split into *actual*, *announced*, *forecast*, and *estimated* |
| **AI Impact** | Productivity, jobs, skills, research output, economic/energy/emissions and social impact |

## What data statuses mean

Every metric record carries exactly one status. The dashboard always shows the status next to the
number so nothing is presented as more certain than it is.

- **Reported** — taken directly from a named publisher's published figure, with a source URL.
- **Calculated** — derived from one or more Reported figures using a documented calculation method.
- **Estimated** — a publisher's own modeled/estimated figure, or a documented estimation method.
- **Unavailable** — no reliable public source could be found. Shown as "Unavailable — reliable
  public data not found," never left blank and never guessed at.
- **Demo** — illustrative placeholder data used only to exercise the interface. Never a real
  statistic. Always carries `isDemo: true` and a visible "Demo data" label.

## Current state of this build

This v1.0.2 package ships with the **interface, data model, validation, and governance
documentation fully built**, populated with a small set of **real, sourced global figures** in
[`public/data/real/verified-metrics.json`](public/data/real/verified-metrics.json) — one figure
per meter, each citing a named public source (Stanford HAI's AI Index, McKinsey's State of AI
survey, the IEA's Energy and AI research, and an open-access research paper) with full source,
license, and confidence metadata. It ships **no demo data** —
`public/data/demo/demo-meters.json` is kept empty for structural compliance only.

Coverage is intentionally **global-only and thin**: six figures is a starting point, not a
survey. Almost every country-, sector-, and use-case-level slot still displays
**Unavailable — reliable public data not found**, because a verified public figure at that
granularity hasn't been sourced and added yet. See [Known limitations](#known-limitations) and
[How to add new data](#how-to-add-new-data) below for how a maintainer extends coverage.

## Running locally

The site is static (HTML/CSS/JS + JSON/CSV) and has no build step, but it fetches its data files
at runtime, so it needs to be served over HTTP rather than opened directly as a `file://` URL.

```bash
cd global-ai-meter
npm test
npm start
```

Then open http://localhost:8080

`npm start` runs `python3 -m http.server 8080 --directory public`. Any static file server works
equally well (`npx serve public`, VS Code "Live Server", etc.) — all data files live under
`public/data/`, so every fetch path in `app.js` resolves relative to `public/index.html` with no
`../` traversal needed.

## Project structure

```
global-ai-meter/
├── README.md
├── LICENSE
├── .gitignore
├── package.json
├── docs/
│   ├── MASTER_SPECIFICATION.md   – full product/data spec this build implements
│   ├── DATA_POLICY.md            – what is/isn't allowed as a data source
│   ├── METER_DEFINITIONS.md      – detailed definition of every meter + metric field
│   └── SOURCE_REVIEW_POLICY.md   – how sources are vetted, licensed, and reviewed
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── app.js                    – hash-router SPA: fetches JSON/CSV, renders every section
│   └── data/
│       ├── registry/
│       │   ├── data-sources.csv      – source registry (empty template + 1 worked example)
│       │   ├── meter-catalog.csv     – catalog of metric IDs/definitions per meter
│       │   ├── countries.json        – country ↔ continent reference list (no statistics)
│       │   ├── sectors.json          – sector reference list
│       │   └── usecases.json         – AI use-case reference list
│       ├── demo/
│       │   └── demo-meters.json      – kept empty; demo-data mechanism documented, unused in v1.0
│       └── real/
│           └── verified-metrics.json – the live dataset: real, sourced global figures (isDemo:false)
└── tests/
    └── meter-validation.test.js  – Node, zero-dependency validation test suite
```

As of v1.0.2, the `data/` folder lives inside `public/` (previously it sat at the project root).
This was a deliberate fix: `app.js`'s fetch paths are resolved relative to `public/index.html`
by the browser, not to the project root, so with the site served via
`python3 -m http.server 8080 --directory public` a project-root `data/` folder was outside the
served directory and every fetch 404'd. Moving `data/` under `public/data/` and pointing
`DATA_SOURCES` at plain relative paths (e.g. `data/registry/countries.json`) fixes this
permanently, regardless of which static file server is used.

## How to add new data

1. Find a public, legally reusable source (see `docs/DATA_POLICY.md` and
   `docs/SOURCE_REVIEW_POLICY.md` before using anything).
2. Add a row to `public/data/registry/data-sources.csv` describing the source (publisher, title, URL,
   publication date, license/reuse basis, access date, etc.) and give it a unique **Source ID**.
3. Add the metric record to `public/data/real/verified-metrics.json` (or a new file under `public/data/real/` —
   point `app.js`'s `DATA_SOURCES` at it and merge it into `metrics` in `boot()`). Every record
   must include every field listed in `docs/METER_DEFINITIONS.md` and reference a real source.
4. Set `status` to `Reported`, `Calculated`, or `Estimated` as appropriate — never `Demo` for a
   real figure, and never leave a real figure unlabeled.
5. Run `node tests/meter-validation.test.js` — it will fail loudly on missing fields, duplicate
   IDs, demo data marked as real, or an unsupported status.

## How to add a new country

Add an entry to `public/data/registry/countries.json` with its ISO code, name, and continent. The
country automatically appears in its continent's directory and shows "Unavailable" for every
meter until real metric records referencing that country are added under step 3 above.

## How to add a new sector

Add an entry to `public/data/registry/sectors.json` (id + display name). It will appear in the Sectors
navigation automatically, showing "Unavailable" until sector-tagged metric records exist.

## How to review sources

Follow `docs/SOURCE_REVIEW_POLICY.md`. In short: publisher must be named and credible, the URL
must be publicly accessible without a login or paywall, the license/reuse basis must be
documented, and conflicting sources are both recorded with the disagreement noted rather than
silently resolved.

## How to update the dashboard

Update the relevant JSON/CSV file(s), bump `lastUpdated` in `public/data/demo/demo-meters.json` (or the
real-data file you're editing), and re-run the validation tests before publishing.

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. In the repo settings, enable **GitHub Pages**, source: `Deploy from a branch`, branch:
   `main`, folder: `/public`.
3. The site will be published at `https://<your-username>.github.io/<repo-name>/`.

No server-side code, database, or paid service is required.

## Browser smoke test

After `npm start`, open http://localhost:8080 and check off each item before publishing a new
build:

- [ ] `index.html` loads with no console errors, and the demo banner is hidden (this build ships
      no demo data).
- [ ] Open the browser's Network tab — every request under `data/` returns `200`, none return
      `404`.
- [ ] Overview page: all **five meter cards** (Activity, Adoption, Infrastructure, Investment,
      Impact) render, and the coverage numbers at the bottom are non-zero.
- [ ] Countries page: the country filter/search box narrows the list as you type.
- [ ] Click into a country, a sector, and a continent detail page — each shows five meter
      sections, each either a sourced record or an "Unavailable" callout.
- [ ] Sources page: the source registry table renders, and each row with a URL shows a working
      "link" that opens the source.
- [ ] On any record card, confirm a **status badge** (Reported/Calculated/Estimated/Unavailable/
      Demo) is visible, and that unavailable metrics read "Unavailable — reliable public data
      not found" rather than a blank or zero value.
- [ ] `npm test` passes with no failures printed.

## Known limitations

- This build ships with **no verified real-world statistics** — see "Current state of this
  build" above. All non-demo metric slots read "Unavailable — reliable public data not found."
- The country and sector reference lists are structural/navigational metadata (names and
  continent groupings), not statistics, and can be extended freely.
- Global AI measurement is inherently incomplete: many countries, sectors, and infrastructure
  figures are not publicly disclosed anywhere, by anyone. Long-term "Unavailable" entries are
  expected and are not a bug.
- This is a client-only static site: it has no backend, no accounts, and stores no personal data.

## Legal and attribution considerations

- The **code** in this repository is MIT-licensed (see `LICENSE`).
- **Source data is not covered by the code license.** Each source's own license/terms continue
  to apply, and attribution may be required — see `docs/DATA_POLICY.md`.
- Third-party content (text, figures, logos, trademarks) must be reviewed individually before
  use; public availability does not by itself mean unrestricted reuse.
- Logos and trademarks of any company, government, or organization are not used anywhere in this
  project and must not be added without explicit permission.
- This project does not claim endorsement by, or affiliation with, any entity it references.

## Demo data handling

This build ships with no demo data. The mechanism still exists for future interface testing: a
demo record would carry `"isDemo": true` and `"status": "Demo"`, the interface would render a
persistent **Demo mode** banner plus a per-card "Demo data" label, and `computeCoverageSummary()`
in `app.js` excludes demo values from real-data totals so they could never silently inflate a
"real" global figure.
