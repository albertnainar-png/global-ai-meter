#!/usr/bin/env python3
"""Build a source-traceable public-data snapshot from free public APIs.

The output deliberately uses public activity signals and explicit Unavailable
records where no defensible free global dataset exists. It never fabricates
country adoption, investment, infrastructure, or impact totals.
"""
from __future__ import annotations

import json
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

OUT = Path("public/data/real/verified-metrics.json")
TODAY = datetime.now(timezone.utc)
SINCE = (TODAY - timedelta(days=7)).date().isoformat()
ACCESS = TODAY.date().isoformat()


def get_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "Global-AI-Meter/1.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def record(metric_id, meter, name, value, unit, period, publisher, title, url,
           status="Calculated", confidence="Medium", geography="Global", notes=""):
    return {
        "metricId": metric_id,
        "meter": meter,
        "metricName": name,
        "value": value,
        "unit": unit,
        "geography": geography,
        "country": None,
        "continent": None,
        "sector": None,
        "reportingPeriod": period,
        "sourcePublisher": publisher,
        "sourceTitle": title,
        "sourceUrl": url,
        "publicationDate": ACCESS,
        "accessDate": ACCESS,
        "licenseBasis": "Public API response; metadata and aggregate count only",
        "calculationMethod": "Direct API count" if status == "Calculated" else None,
        "confidence": confidence,
        "status": status,
        "notes": notes,
        "isDemo": False,
    }


def unavailable(metric_id, meter, name, notes):
    return record(metric_id, meter, name, None, None, "Current snapshot", "Global AI Meter",
                  "No defensible free global dataset identified", "https://github.com/albertnainar-png/global-ai-meter",
                  status="Unavailable", confidence="—", notes=notes)


def main():
    records = []
    source_errors = []

    try:
        q = urllib.parse.quote("artificial intelligence")
        url = f"https://api.github.com/search/repositories?q={q}+created:%3E={SINCE}&per_page=1"
        data = get_json(url)
        records.append(record(
            "ACT-GITHUB-AI-7D", "activity", "New public GitHub repositories matching artificial intelligence",
            data.get("total_count"), "repositories", f"Last 7 days ending {ACCESS}", "GitHub public REST API",
            "Repository search API", "https://docs.github.com/en/rest/search/search#search-repositories",
            notes="Search-result count, not a census of all AI development. Query: artificial intelligence + repository creation date.",
        ))
    except Exception as exc:
        source_errors.append(f"GitHub: {type(exc).__name__}")

    try:
        q = urllib.parse.quote("artificial intelligence")
        url = f"https://api.openalex.org/works?search={q}&filter=from_publication_date:{SINCE},is_oa:true&per-page=1"
        data = get_json(url)
        records.append(record(
            "ACT-OPENALEX-AI-7D", "activity", "Open-access research works matching artificial intelligence",
            data.get("meta", {}).get("count"), "works", f"Last 7 days ending {ACCESS}", "OpenAlex",
            "OpenAlex works API", "https://api.openalex.org/works",
            confidence="High", notes="OpenAlex search/filter count. It is a searchable scholarly signal, not all AI research worldwide.",
        ))
    except Exception as exc:
        source_errors.append(f"OpenAlex: {type(exc).__name__}")

    try:
        models = get_json("https://huggingface.co/api/models?sort=createdAt&direction=-1&limit=100")
        recent = [m for m in models if m.get("createdAt", "")[:10] >= SINCE]
        records.append(record(
            "ACT-HF-MODELS-7D", "activity", "Public Hugging Face models created in the last 7 days",
            len(recent), "models", f"Last 7 days ending {ACCESS}", "Hugging Face Hub API",
            "Hugging Face Hub models API", "https://huggingface.co/docs/hub/api",
            notes="Count is based on the latest public API page and is therefore a bounded activity signal, not a complete global count.",
        ))
    except Exception as exc:
        source_errors.append(f"Hugging Face models: {type(exc).__name__}")

    try:
        datasets = get_json("https://huggingface.co/api/datasets?sort=createdAt&direction=-1&limit=100")
        recent = [d for d in datasets if d.get("createdAt", "")[:10] >= SINCE]
        records.append(record(
            "ACT-HF-DATASETS-7D", "activity", "Public Hugging Face datasets created in the last 7 days",
            len(recent), "datasets", f"Last 7 days ending {ACCESS}", "Hugging Face Hub API",
            "Hugging Face Hub datasets API", "https://huggingface.co/docs/hub/datasets",
            notes="Count is based on the latest public API page and is a bounded activity signal, not a complete global count.",
        ))
    except Exception as exc:
        source_errors.append(f"Hugging Face datasets: {type(exc).__name__}")

    records.extend([
        unavailable("ADOPT-COUNTRY-COVERAGE", "adoption", "Country-level AI adoption percentage",
                    "No single free, current, comparable global country dataset was found. Country values must be added from official statistical or survey sources individually."),
        unavailable("ADOPT-SECTOR-COVERAGE", "adoption", "Sector-level AI adoption percentage",
                    "Sector adoption varies by survey design and year. The dashboard will add individually sourced survey records rather than invent a global average."),
        unavailable("INFRA-GPU-GLOBAL", "infrastructure", "Global AI GPU capacity",
                    "A complete, current, free, public global GPU-capacity dataset is not available. Public cloud and company disclosures can be added as separate records."),
        unavailable("INV-GLOBAL-TOTAL", "investment", "Global AI investment total",
                    "Free sources report different scopes and definitions. Investment records will be added individually from official filings and public announcements."),
        unavailable("IMP-GLOBAL-PRODUCTIVITY", "impact", "Global AI productivity impact",
                    "No single live global measure exists. Impact must be represented with dated studies, surveys, and country statistics with their methodology preserved."),
    ])

    payload = {
        "lastUpdated": ACCESS,
        "generatedAt": TODAY.isoformat(),
        "mode": "live-public-signals",
        "note": "Live public API signals plus explicit Unavailable records. No illustrative demo values are included.",
        "sourceErrors": source_errors,
        "records": records,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(records)} records to {OUT}; source errors: {len(source_errors)}")


if __name__ == "__main__":
    main()
