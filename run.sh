#!/bin/sh

# Get new data.
python scripts/scraper.py
# Re-generate metadata.
python scripts/meta.py
# Re-generate front-end summary data.
python scripts/summarizer.py
