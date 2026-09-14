# Legal, Copyright, and Data-Access Audit

**Status: public beta safeguards — not legal advice or a legal clearance.**

## Scope

This audit covers the public-data approach used by Global AI Meter. It does not replace review by a qualified lawyer or the terms of each source at the time of use.

## Approved collection principles

- Use official public APIs, official RSS/Atom feeds, or openly licensed public datasets.
- Store metadata and derived statistics only: title, source, URL, date, value, methodology, confidence, and status.
- Do not store full article bodies, long excerpts, publisher images, logos, or paywalled content.
- Do not collect personal data, usernames, emails, employee data, client data, or private repository data.
- Do not use credentials, tokens, cookies, scraping bypasses, or access-controlled endpoints.
- Respect rate limits, API terms, robots directives where applicable, and source-specific licenses.
- Link to the original publisher and preserve required attribution.
- Do not imply endorsement, sponsorship, affiliation, or certification by any source organization.

## Source treatment

### GitHub

Use only aggregate public repository metadata needed for the metric. Do not collect contributor personal information or use the API for spam, profiling, recruiting, or resale of personal data. Respect GitHub API rate limits and terms.

### Hugging Face

Use public Hub metadata only where the endpoint and the individual repository/model/dataset license permit the intended use. A public model or dataset is not automatically unrestricted. Do not redistribute model files, dataset contents, or copyrighted descriptions.

### OpenAlex

Prefer OpenAlex metadata and open-access works with an identifiable license. Treat CC0 metadata as reusable, but check the license of the linked work itself before copying any full text or figures. The project stores links and short metadata, not paper contents.

### arXiv

Use RSS/Atom metadata and links for discovery. Do not mirror full papers, figures, or abstracts beyond what is necessary and permitted. Link users to the canonical arXiv record or paper.

### News and aggregators

Do not use aggregator feeds when the reuse terms are unclear. Prefer first-party research feeds and official announcements. Store headline, publisher, date, and link only; never reproduce article text.

## Metric-status rules

Every record must be labelled as one of:

- `Live` — automatically refreshed public signal
- `Reported` — published figure from an identifiable source
- `Calculated` — transparent calculation from sourced inputs
- `Estimated` — modelled or approximate figure
- `Historical` — older figure retained for context
- `Unavailable` — no suitable public figure found
- `Demo` — illustrative only and excluded from real totals

The word **live** must not be used for annual reports, historical figures, or estimates.

## Pre-publication checklist

Before adding or refreshing a source:

- [ ] URL is publicly reachable without login or paywall.
- [ ] Publisher is identifiable.
- [ ] Publication date and reporting period are recorded separately.
- [ ] License or reuse basis is recorded.
- [ ] Intended use is limited to metadata, facts, links, or permitted derived values.
- [ ] No personal, confidential, employee, or client data is included.
- [ ] No full text, images, logos, or substantial copyrighted material is copied.
- [ ] API rate limits and terms are respected.
- [ ] Source attribution and canonical link are present.
- [ ] The metric label does not overstate what the source measures.
- [ ] A reviewer can reproduce the calculation.

## Current audit conclusion

The project can operate as a cautious public-information beta when it follows this policy. It must not claim to be legally cleared, universally comprehensive, or an official authority. Source terms can change, so every automated source should be rechecked periodically.

## Suggested public disclaimer

> Global AI Meter is an independent public-information project. It uses publicly accessible APIs, feeds, datasets, and reports and links to original publishers. Data is presented for informational purposes and labelled by evidence status. No endorsement, sponsorship, or affiliation is implied. Third-party data remains subject to its original terms and licenses.
