#!/usr/bin/env python
import json

from profanity import profanity
# Too many false positives with "cockroaches".
profanity.get_words()
profanity.words.remove('cock')

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

def summarize_stats():
    stats = {}
    stats['count'] = db.requests.count()
    profane_requests = 0
    for request in db.requests.find():
        if profanity.contains_profanity(request['requested_action']):
            profane_requests += 1
    stats['profane_requests'] = profane_requests

    return stats

def make_summaries():
  summaries = {}
  summaries['by_year'] = summarize_by_year()
  summaries['by_month'] = summarize_by_month()
  summaries['by_building'] = summarize_by_building()
  print('Generating stats. This may take a couple of minutes.')
  summaries['stats'] = summarize_stats()

  return summaries

def main():
  summaries = make_summaries()
  with open(OUT_FILE, 'w') as f:
    json.dump(summaries, f)
  print("Wrote summary data to %s" % OUT_FILE)

if __name__ == '__main__':
  main()
