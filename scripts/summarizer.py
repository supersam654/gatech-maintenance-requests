#!/usr/bin/env python
import json

import db

# note that this file is relative to the root of the project, not this file.
OUT_FILE = 'site/frontend_data/summaries.json'

def summarize_by_year():
    pipeline = [{
        '$project': {
            'year': {'$year': '$ack_date'}
        }
    }, {
        '$group': {
            '_id': '$year',
            'count': {'$sum': 1}
        }
    }, {
        '$project': {
            '_id': False,
            'year': '$_id',
            'count': '$count'
        }
    }]

    return list(db.requests.aggregate(pipeline))

def summarize_by_month():
    pipeline = [{
        '$project': {
            'month': {'$month': '$ack_date'}
        }
    }, {
        '$group': {
            '_id': '$month',
            'count': {'$sum': 1}
        }
    }, {
        '$project': {
            '_id': False,
            'month': '$_id',
            'count': '$count'
        }
    }]

    return list(db.requests.aggregate(pipeline))

def summarize_by_building():
    pipeline = [{
        '$project': {
            'building': '$building'
        }
    }, {
        '$group': {
            '_id': '$building',
            'count': {'$sum': 1}
        }
    }, {
        '$project': {
            '_id': False,
            'building': '$_id',
            'count': '$count'
        }
    }]

    return list(db.requests.aggregate(pipeline))

def make_summaries():
  summaries = {}
  summaries['by_year'] = summarize_by_year()
  summaries['by_month'] = summarize_by_month()
  summaries['by_building'] = summarize_by_building()

  return summaries

def main():
  summaries = make_summaries()
  with open(OUT_FILE, 'w') as f:
    json.dump(summaries, f)
  print("Wrote summary data to %s" % OUT_FILE)

if __name__ == '__main__':
  main()
