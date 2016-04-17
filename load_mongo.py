from pymongo import MongoClient
import json

IN_FILE = 'data.txt'
CONNECTION_STRING = 'localhost'

def main():
    client = MongoClient(CONNECTION_STRING)
    db = client['work_orders']
    i = 0

    print("Deleting requests DB so we don't think about duplicates.")
    db.requests.drop()

    with open(IN_FILE) as f:
        documents = []
        for line in f:
            documents.append(json.loads(line))
            i += 1
            if i % 1000 == 0:
                db.requests.insert_many(documents)
                documents = []
                print('Loaded %d records' % i)

        if len(documents) > 0: db.requests.insert_many(documents)

if __name__ == '__main__':
    main()
