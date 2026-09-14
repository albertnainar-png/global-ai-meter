# Source Audit Report

**Date:** 2026-09-14  
**Repository:** `albertnainar-png/global-ai-meter`

## Decision

The current metric records are **quarantined**. They remain in the data file for schema continuity, but their numeric values are set to `null` and their status is `Unavailable` until the source, figure, date, methodology, and reuse basis are reviewed.

The dashboard's existing **demo data notification is intentionally preserved**. This change does not remove or weaken that notification.

## Findings

- The source registry contained a worked-example row. It has been removed.
- The previously populated metrics were not treated as independently verified merely because they had named publishers and URLs.
- The registry now records `reviewStatus=quarantined` and pending URL, figure, and license checks.
- No quarantined figure should be presented as a live, verified, or current measurement.
- The source registry is metadata only; it does not grant permission to reproduce source content.

## Required review before reactivation

1. Open the canonical source URL and confirm that it resolves to the intended publication.
2. Confirm the exact figure, unit, reporting period, and wording.
3. Confirm whether the number is reported, estimated, modeled, self-reported, or calculated.
4. Check the source's current copyright/license/reuse terms.
5. Record the access date and reviewer decision.
6. Reactivate only the specific record that passes review; leave unsupported records `Unavailable`.

## Scope

This is a repository/data-governance review, not legal advice or a legal clearance. If a source's reuse terms are unclear, obtain review from the appropriate legal or policy owner before publishing the figure.
