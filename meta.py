import re
from collections import defaultdict
import json

import db

with open('descriptions.json') as f:
    descriptions = json.load(f)

def get_all_codes():
    return db.requests.distinct('order_data.code')

def get_categories_from_codes(codes):
    categories = defaultdict(list)
    for code in codes:
        category = re.split('\d', code, 1)[0]
        categories[category].append(code)
    categories = dict(categories)
    for category_codes in categories.values():
        category_codes.sort()
    return categories

def get_code_meta(code):
    query = {'order_data.code': code}
    total_requests = db.requests.count(query)
    description = descriptions.get(code, 'No description available.')
    sample_request = db.requests.find_one(query)['requested_action']
    first_date = db.requests.find(query).sort('ack_date', 1).limit(1)[0]['ack_date']
    last_date = db.requests.find(query).sort('ack_date', -1).limit(1)[0]['ack_date']

    return {
        'code': code,
        'description': description,
        'sample_request': sample_request,
        'count': total_requests,
        'first_date': first_date,
        'last_date': last_date
    }

def get_all_codes_and_meta():
    codes = get_all_codes()
    categories = get_categories_from_codes(codes)
    meta = {}
    for category, category_codes in categories.items():
        print(category)
        meta[category] = {}
        for code in category_codes:
            code_meta = get_code_meta(code)
            code_meta['category'] = category
            meta[category][code] = code_meta
        yield category, meta[category]
    # 
    # return categories, meta

def main():
    print('Generating all metadata for all request types.')
    for category, category_meta in get_all_codes_and_meta():
        for meta_code in category_meta.values():
            db.code_meta.insert(meta_code)

if __name__ == '__main__':
    main()
