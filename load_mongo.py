import db
import json

IN_FILE = 'data.txt'

def main():
    i = 0
    print("Deleting requests DB so we don't think about duplicates.")
    db.requests.drop()

    with open(IN_FILE) as f:
        documents = []
        for line in f:
            document = json.loads(line)
            document['work_request'] = int(document['work_request'])
            documents.append(document)
            i += 1
            if i % 1000 == 0:
                db.requests.insert_many(documents)
                documents = []
                print('Loaded %d records' % i)

        if len(documents) > 0: db.requests.insert_many(documents)

if __name__ == '__main__':
    main()
