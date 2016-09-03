import db
from scraper import to_date

# This file is a reference point for future data migrations.
# The migrations have almost all been dates as strings to dates as Date objects.

# Note that everything in this file is idempotent and should cause 0 changes to the data from the latest version of the crawler.

def get_string_dates_query(field):
    return {'$and': [{field: {'$not': {'$type': 'null'}}}, {field: {'$not': {'$type': 'date'}}}]}

def string_field_to_date(field):
    i = 0
    for request in db.requests.find(get_string_dates_query(field)):
        i += 1
        db.requests.update({'_id': request['_id']}, {'$set': {field: to_date(request[field])}})

        if i % 1000 == 0:
            print(i)
    print('Upgraded %d records from strings to dates on %s.' % (i, field))

string_field_to_date('reject_date')
string_field_to_date('accept_date')
