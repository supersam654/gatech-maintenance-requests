from pymongo import MongoClient

_CONNECTION_STRING = 'localhost'

_client = MongoClient(_CONNECTION_STRING)
_db = _client['work_orders']

# The only thing that should be used publically.
requests = _db['requests']
