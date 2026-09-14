#!/usr/bin/env python3
"""Fetch public AI research/news feeds into a static JSON file."""
from __future__ import annotations

import json
import time
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

OUT = Path("public/data/live/live-feeds.json")
FEEDS = {
    "arxiv_ai": "https://rss.arxiv.org/rss/cs.AI",
    "google_news_ai_research": "https://news.google.com/rss/search?q=artificial+intelligence+research&hl=en-US&gl=US&ceid=US:en",
    "huggingface_papers": "https://huggingface.co/papers/rss",
}


def text(node, *names):
    for name in names:
        child = node.find(name)
        if child is not None and child.text:
            return child.text.strip()
    return ""


def parse_feed(xml_bytes: bytes, source: str) -> list[dict]:
    root = ET.fromstring(xml_bytes)
    atom = "{http://www.w3.org/2005/Atom}"
    items = root.findall(".//item") or root.findall(f".//{atom}entry")
    result = []
    for item in items[:10]:
        link = text(item, "link", f"{atom}id")
        if not link:
            link_node = item.find(f"{atom}link")
            link = link_node.attrib.get("href", "") if link_node is not None else ""
        result.append({
            "title": text(item, "title", f"{atom}title"),
            "url": link,
            "publishedAt": text(item, "pubDate", "published", "updated", f"{atom}published", f"{atom}updated"),
            "source": source,
        })
    return [item for item in result if item["title"] and item["url"]]


def main() -> None:
    feeds = []
    statuses = {}
    for name, url in FEEDS.items():
        try:
            request = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0 (compatible; Global-AI-Meter/1.0)",
                    "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
                },
            )
            with urllib.request.urlopen(request, timeout=30) as response:
                feeds.extend(parse_feed(response.read(), name))
            statuses[name] = "ok"
        except Exception as exc:
            statuses[name] = f"unavailable: {type(exc).__name__}"

    # Keep the newest items first and avoid duplicate URLs.
    unique = {}
    for item in feeds:
        unique[item["url"]] = item
    feeds = list(unique.values())[:20]

    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "status": statuses,
        "items": feeds,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(feeds)} feed items to {OUT}")
    time.sleep(0.1)


if __name__ == "__main__":
    main()
