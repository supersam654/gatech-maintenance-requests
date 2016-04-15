from pymongo import MongoClient
import json

IN_FILE = 'data.txt'
CONNECTION_STRING = 'localhost'

def main():
    client = MongoClient(CONNECTION_STRING)
    db = client['work_orders']
    i = 0

    bulkUpdate = db.requests.initialize_unordered_bulk_op()
    foundRequest = False

    with open(IN_FILE) as f:
        for line in f:
            i += 1
            if i % 1000 == 0:
                if foundRequest: bulkUpdate.execute()
                bulkUpdate = db.requests.initialize_unordered_bulk_op()
                print('Loaded %d records' % i)
                foundRequest = False

            data = json.loads(line)
            bulkUpdate.find(data).upsert().update_one({'$set': data})
            foundRequest = True
    if foundRequest: bulkUpdate.execute()

if __name__ == '__main__':
    main()
