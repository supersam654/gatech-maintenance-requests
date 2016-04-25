#!/bin/sh

# Get new data.
python scraper.py
# Re-generate metadata.
python meta.py
# Re-generate front-end summary data.
python summarizer.py
