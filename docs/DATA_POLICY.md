# Data Policy

This policy governs everything that is allowed to enter Global AI Meter as real (non-demo) data.
It applies to every contributor, at every point in time — it is not a one-time launch checklist.

## 1. Allowed sources

A source may be used only if **all** of the following are true:

- It is **publicly accessible** without a login, account, paywall, or access request.
- It is **legally reusable**: either explicitly licensed for reuse (e.g. CC-BY, open government
  data, public-domain), or used strictly within the bounds of fair use / fair dealing for a small
  factual excerpt with attribution — never a substantial reproduction of the original text.
- It **names a real, identifiable publisher** (a statistics agency, a company's own published
  report, an academic paper, a recognized research organization, a government body, etc.).
- It has a **stable, citable URL** and a **publication date**.

## 2. Never allowed, under any circumstance

- Confidential, private, or internal information of any kind.
- Personal data, sensitive personal data, or data about identifiable individuals.
- Employee data, client data, or employer data from any organization, including the
  maintainers' own.
- Content behind a login wall, paywall, or access control — including if a contributor
  personally has access.
- Paid APIs or paid data subscriptions, even if a contributor has a personal subscription.
- Scraping in violation of a site's terms of service.
- Large-scale copying of copyrighted text, tables, or datasets.
- Logos, trademarks, or brand assets, without the rights holder's explicit permission.
- Any statement, explicit or implied, that a company, government, or organization endorses or
  is affiliated with Global AI Meter.

## 3. When reliable data can't be found

The record is created (or the slot is left in place) with:

- `status: "Unavailable"`
- Displayed to users as: **"Unavailable — reliable public data not found."**
- Never silently omitted, never estimated "to fill the gap," never replaced with a plausible
  guess.

## 4. Demo data

A small amount of illustrative demo data is permitted **only** to exercise the interface, subject
to every one of these rules:

- `"isDemo": true` on the record.
- `"status": "Demo"` on the record.
- Rendered in the UI with a visible **"Demo data"** label, every time it is shown.
- Never described anywhere as a real-world statistic.
- Never included in any aggregate, summary, or "coverage" calculation that a user could mistake
  for real-world measurement.
- The site shows a persistent demo-mode banner for as long as any demo data is loaded.

## 5. Record-level validation rules

Enforced by `tests/meter-validation.test.js`. A record is invalid if any of the following is true:

- Missing Metric ID, Metric name, Source URL (for Reported/Calculated/Estimated records), or
  Reporting period.
- Missing or invalid Data status (must be one of: Reported, Calculated, Estimated, Unavailable,
  Demo).
- Invalid meter category (must be one of the five defined meters).
- Invalid confidence value (must be one of: High, Medium, Low — see `METER_DEFINITIONS.md`).
- Duplicate Metric ID or duplicate Source ID within the registry.
- A record marked `isDemo: true` but `status` not equal to `"Demo"`, or vice versa — demo status
  and the demo flag must always agree.
- A negative value where the metric definition does not allow negative values (e.g. counts,
  percentages of adoption, headcounts).
- Missing License/reuse basis on any Reported/Calculated/Estimated record.
- Missing Calculation method on any record with `status: "Calculated"`.
- Missing Estimation method (recorded in Notes/Calculation method) on any record with
  `status: "Estimated"`.

## 6. Licensing note

Global AI Meter's own **code** is MIT-licensed. That license does **not** extend to third-party
source data, which remains under its original publisher's terms. See `SOURCE_REVIEW_POLICY.md`
for how each source's license is checked and recorded before use.
