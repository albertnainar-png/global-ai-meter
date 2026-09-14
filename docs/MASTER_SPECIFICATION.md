# Master Specification — Global AI Meter v1.0

## 1. Mission

Global AI Meter is an independent, public-facing dashboard for exploring the global AI landscape
across five dimensions: **Activity, Adoption, Infrastructure, Investment, and Impact** — broken
down by continent, country, sector, and use case, with every figure traceable to a named public
source.

Positioning statement (used verbatim on the homepage and in social metadata):

> Global AI Meter: One place to explore the world's AI activity, adoption, infrastructure,
> investment, and impact.

This project **is not** an official or authoritative global measurement body, is **not**
affiliated with any company, government, or organization, and does **not** claim endorsement by
any of the sources it references.

## 2. Data rules (summary — see `DATA_POLICY.md` for the full policy)

- Only publicly accessible, legally reusable information may be entered as real data.
- No invented statistics. No demo data presented as real. No confidential, personal, employee,
  client, or employer data. No paywalled, login-only, or paid-API/subscription sources. No
  terms-of-service-violating scraping. No large-scale copying of copyrighted text. No logos,
  trademarks, or branding without permission. No claimed endorsement.
- Where reliable public data cannot be found, the interface shows exactly:
  `Unavailable — reliable public data not found.`

## 3. Required record fields

Every real metric record must carry: Metric ID, Metric name, Value, Unit, Geography, Country
(if applicable), Continent (if applicable), Sector (if applicable), Reporting period, Source
publisher, Source title, Source URL, Publication date, Access date, License/reuse basis,
Calculation method, Confidence level, Data status, Notes. The exact shape is defined in
`METER_DEFINITIONS.md` and enforced by `tests/meter-validation.test.js`.

Allowed data statuses: `Reported`, `Calculated`, `Estimated`, `Unavailable`, `Demo`.

## 4. The five meters

See `METER_DEFINITIONS.md` for full detail. Summary:

1. **AI Activity** — usage, model activity, traffic, prompts/tokens, public activity estimates.
2. **AI Adoption** — country/industry/organization/workforce adoption, use-case adoption,
   adoption maturity.
3. **AI Infrastructure** — data centers, GPUs/chips, compute capacity, energy use, infrastructure
   investment, cloud AI capacity.
4. **AI Investment** — venture, corporate, and government funding, split into Actual / Announced
   / Forecast / Estimated.
5. **AI Impact** — productivity, jobs, skills, research, economic/energy/emissions, social impact.

## 5. Site sections (implemented as SPA routes in `public/app.js`)

| Route | Section |
|---|---|
| `#/overview` | Global Overview — title, explanation, five meter cards, coverage summary, demo-mode notice |
| `#/continents` and `#/continents/:id` | Africa, Asia, Europe, North America, South America, Oceania |
| `#/countries` and `#/countries/:iso` | Country directory + per-country profile |
| `#/sectors` and `#/sectors/:id` | 17 sectors from the brief |
| `#/usecases` | AI use-case categories |
| `#/sources` | Source registry table |
| `#/methodology` | This document's summary, rendered for end users |
| `#/about` | Why the project exists, its independence, its limitations |

## 6. Demo data rules

- Every demo record: `"isDemo": true`, `"status": "Demo"`.
- Every demo value renders with a visible **Demo data** badge.
- Demo values are excluded from all aggregate/coverage calculations.
- A persistent demo-mode banner appears site-wide while any demo data is loaded.

## 7. Technical approach

Static HTML/CSS/vanilla-JS single-page app, hash-routed, reading JSON/CSV files with `fetch()`.
No backend, no database, no paid services, no build step, no framework. Deployable as-is to
GitHub Pages from `/public`.

## 8. Validation

`tests/meter-validation.test.js` is a dependency-free Node script that loads every data file and
checks the rules listed in `docs/DATA_POLICY.md` §5 (missing required fields, invalid category,
invalid confidence, duplicate IDs, demo-as-real, unsupported negative values, missing
calculation/estimation method). It exits non-zero and prints every violation if any check fails.

## 9. Deviations from the brief's suggested structure

None. The repository follows the structure specified in the brief exactly.
