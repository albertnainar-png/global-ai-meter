# Source Review Policy

## Purpose

Every figure on Global AI Meter must be traceable to a specific, checkable public source. This
document defines how a source is reviewed, recorded, and (if it fails review) rejected, before
any metric record is allowed to cite it.

## Review checklist (must pass all)

1. **Access** — the source is reachable by any member of the public, right now, without a login,
   paywall, trial, or account creation.
2. **Publisher identity** — the publishing organization or author is named and identifiable
   (not an anonymous aggregator).
3. **License / reuse basis** — one of:
   - An explicit open license (CC-BY, CC0, ODbL, government open-data license, etc.) — record the
     license name.
   - Public-domain government statistics — record the jurisdiction and basis.
   - Fair use / fair dealing for a short factual excerpt with attribution — only for small,
     clearly-attributed figures, never for reproducing substantial original text or datasets in
     bulk.
   - If none of the above applies, the source is **rejected**.
4. **Currency** — the publication date is recorded, and the reporting period the figure describes
   is recorded separately from the publication date.
5. **No prohibited content** — the source is not a personal-data, employee-data, client-data, or
   confidential-data source; does not require bypassing any access control; and is not a paid
   API/subscription.

## Recording a source

Every reviewed source gets one row in `data/registry/data-sources.csv` with a unique **Source
ID**, and every metric record that cites it references that Source ID. A source is reviewed once
and reused by many metric records.

## Handling conflicting sources

When two credible public sources disagree on the same figure:

- **Both** are recorded as separate metric records (do not average or silently pick one).
- Each record's `notes` field states that a conflicting figure exists and names the other
  source's publisher.
- Confidence is assessed independently for each (see `METER_DEFINITIONS.md`).
- The interface displays both, so a user can judge for themselves — Global AI Meter does not
  arbitrate between two named public sources.

## Handling missing data

If the review checklist above cannot be satisfied for a given metric/geography/sector
combination, the record is entered (or the UI slot is left) with `status: "Unavailable"`, shown
to users as: **"Unavailable — reliable public data not found."** This is a legitimate,
expected, and common outcome — not an error to be hidden.

## Recording updates

Any change to a metric's value, status, or source requires:
- Updating `accessDate` to the date of re-verification.
- Updating `publicationDate` if a newer edition of the source is used.
- A note in the record's `notes` field describing what changed and why, if the value itself
  changed.
- Bumping the relevant data file's `lastUpdated` field.

## Logos, trademarks, and endorsement

Logos and brand marks are never used, regardless of the source's license terms for its text/data,
without separate, explicit permission from the rights holder. No page on this site may state or
imply that any company, government, or organization endorses, sponsors, or is affiliated with
Global AI Meter.
