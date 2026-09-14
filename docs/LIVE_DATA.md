# Live public-data roadmap

Global AI Meter now runs in **live public-data mode**.

## Phase 1 — live public activity signals

The scheduled workflow queries free public APIs for:

- GitHub repositories matching artificial intelligence created in the last seven days
- OpenAlex open-access works matching artificial intelligence published in the last seven days
- Hugging Face public models created in the last seven days
- Hugging Face public datasets created in the last seven days
- Public research/news RSS feeds

These are activity signals, not a claim to measure all AI activity worldwide.

## Phase 2 — adoption and country/sector coverage

Country and sector adoption is only added when a dated, attributable public statistical or survey source is available. The pipeline emits explicit `Unavailable` records instead of inventing percentages or combining incompatible surveys.

## Phase 3 — infrastructure, investment, and impact

These categories use the same rule:

- official public datasets, filings, or reports only;
- source URL, date, scope, and methodology retained;
- reported, calculated, estimated, and unavailable values visibly separated;
- no proprietary database scraping or copied article/report text.

A complete live global total is not asserted where no defensible free dataset exists. The dashboard therefore includes transparent `Unavailable` records for global GPU capacity, global AI investment total, and global productivity impact until suitable sources are added.

## Refresh

The GitHub Actions workflow `Refresh live AI feeds` runs on a daily schedule and can also be started manually. It updates:

- `public/data/real/verified-metrics.json`
- `public/data/live/live-feeds.json`

The public dashboard remains static and reads the generated JSON files.
