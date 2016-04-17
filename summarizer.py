#!/usr/bin/env python
import json
from collections import defaultdict
from datetime import datetime

OUT_FILE = 'summaries.json'
IN_FILE = 'data.txt'

def group_by_year_and_month(buckets, data):
  try:
    data['request_date'] = data['accept_date'] or data['reject_date']
    # Only one of these fields will have any data in it.
    date = datetime.strptime(data['request_date'], '%m/%d/%Y')
    bucket = date.strftime('%Y-%m')
    buckets[bucket].append(data)
  except ValueError:
    print("Skipping %s because it has an invalid request date: %s" % (data['work_request'], data['request_date']))

def summarize_by_weekday(bucket):
  days = defaultdict(int)
  for request in bucket:
    day_of_request = datetime.strptime(request['request_date'], '%m/%d/%Y').weekday()
    days[day_of_request] += 1
  return days

def summarize_by_month(bucket):
  return len(bucket)

def summarize_by_building(bucket):
  buildings = defaultdict(int)
  for request in bucket:
    buildings[request['building']] += 1
  return buildings

def make_summaries(buckets):
  summaries = defaultdict(dict)
  for key, bucket in buckets.items():
    summaries['by_weekday'][key] = summarize_by_weekday(bucket)
    summaries['by_month'][key] = summarize_by_month(bucket)
    summaries['by_building'][key] = summarize_by_building(bucket)
  return dict(summaries)

def main():
  buckets = defaultdict(list)
  print("Reading raw data and sorting into buckets by year and month.")
  with open(IN_FILE) as f:
    # The first line is corrupt so skip it. I'll fix that later.
    f.readline()
    for line in f:
      group_by_year_and_month(buckets, json.loads(line))
  print("Read %d lines." % sum(len(bucket) for bucket in buckets.values()))
  summaries = make_summaries(buckets)
  with open(OUT_FILE, 'w') as f:
    json.dump(summaries, f)
  print("Wrote summary data to %s" % OUT_FILE)

if __name__ == '__main__':
  main()
