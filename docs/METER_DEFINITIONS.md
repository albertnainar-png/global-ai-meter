# Meter Definitions

## The five meters

### 1. AI Activity Meter
What it measures: how much AI is actually being used, in public-facing or publicly-disclosed
terms. In scope: AI usage figures, model activity, AI-attributable web/app traffic, prompt or
token volumes disclosed by a provider, public activity estimates from named researchers.

### 2. AI Adoption Meter
What it measures: how broadly AI has been taken up. In scope: country-level adoption surveys,
industry/sector adoption rates, organization-level adoption, workforce adoption (share of workers
using AI tools), use-case adoption, and adoption-maturity assessments from named research bodies.

### 3. AI Infrastructure Meter
What it measures: the physical and cloud capacity underlying AI. In scope: data center counts and
capacity, GPU/AI chip figures, compute capacity, energy use attributable to AI infrastructure,
infrastructure investment, and cloud AI capacity as disclosed by providers or regulators.

### 4. AI Investment Meter
What it measures: money committed to AI, **explicitly split by certainty**:
- **Actual** — funds that have been disbursed/closed, per a named source.
- **Announced** — a public announcement of intended investment, not yet confirmed disbursed.
- **Forecast** — a third party's projection of future investment.
- **Estimated** — a modeled figure, with the estimation method disclosed.

A record's `investmentType` field must be set to one of these four, and this is separate from
(but often correlated with) the record's `status` field.

### 5. AI Impact Meter
What it measures: downstream effects of AI. In scope: productivity studies, employment/jobs
figures, skills-gap data, research output (e.g. publication counts), economic-impact estimates,
energy/emissions impact, and social-impact findings from named, credible sources.

## Required fields on every real (non-Demo, non-Unavailable-only) metric record

| Field | Description |
|---|---|
| `metricId` | Unique, stable identifier, e.g. `ACT-GLOBAL-0001` |
| `metricName` | Human-readable name |
| `meter` | One of: `activity`, `adoption`, `infrastructure`, `investment`, `impact` |
| `value` | Numeric value, or `null` when `status` is `Unavailable` |
| `unit` | Unit of measurement (e.g. `%`, `USD`, `count`, `MW`) |
| `geography` | `Global`, a continent name, or a country name |
| `country` | ISO country code, if applicable, else `null` |
| `continent` | Continent name, if applicable, else `null` |
| `sector` | Sector id, if applicable, else `null` |
| `reportingPeriod` | e.g. `2025`, `2025-Q3`, `2024-2025` |
| `sourcePublisher` | Name of the publishing organization |
| `sourceTitle` | Title of the source document/page |
| `sourceUrl` | Public, stable URL |
| `publicationDate` | ISO date the source was published |
| `accessDate` | ISO date the source was accessed by a contributor |
| `licenseBasis` | e.g. `CC-BY-4.0`, `Public domain (government data)`, `Fair use — short factual excerpt` |
| `calculationMethod` | Required if `status` is `Calculated` or `Estimated`; free text describing the method |
| `confidence` | `High`, `Medium`, or `Low` |
| `status` | `Reported`, `Calculated`, `Estimated`, `Unavailable`, or `Demo` |
| `notes` | Free text — caveats, conflicting sources, definitional notes |
| `isDemo` | `true` only for illustrative Demo records, else `false` |

## Confidence levels

- **High** — a single, authoritative, primary source; methodology is disclosed and sound.
- **Medium** — a credible source, but methodology is partially disclosed, or the figure is a
  secondary citation of a primary source Global AI Meter could not independently verify.
- **Low** — a plausible but weakly-sourced or self-reported figure; shown with an explicit caveat
  in `notes`.

## Confidence and status are independent

A `Reported` figure can still have `Low` confidence (e.g. a single company's self-reported claim
with no methodology disclosed). Both fields are always shown together in the interface so users
can judge a figure for themselves rather than relying on status alone.
