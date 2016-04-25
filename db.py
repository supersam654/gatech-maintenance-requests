from pymongo import MongoClient, ASCENDING

_CONNECTION_STRING = 'localhost'

_client = MongoClient(_CONNECTION_STRING)
_db = _client['work_orders']

# Index makes processing metadata go from ~2 minutes to ~2 seconds :)
_db.requests.create_index([('order_data.code', ASCENDING)])

# The only thing that should be used publically.
requests = _db['requests']
code_meta = _db['code_meta']
