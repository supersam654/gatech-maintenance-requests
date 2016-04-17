# Georgia Tech Work Orders

This project is an analysis of all maintenance requests accepted by the Georgia Tech Department of Housing since 10/12/2005. This is the earliest time I can find work orders (GH-1185).

## Viewing the Data

All of the data has been `mongodump`ed very typically into the `dump` directory. See `export_mongo.sh` for the exact command used to generate the dump.

## Dependencies

* Python (2 or 3)
* Requests
* BeautifulSoup 4
* PyMongo
* Mongo 3

## Grabbing the latest data

To get more data, have a local `mongod` instance running. Then run `python scraper.py`. If you want to be a nice person, run `export_mongo.sh` and commit that too.

## License

I'm not sure what license the actual work order data is under. I have been unable to find any information on the rights related to this data. I'd assume that it's copyright Georgia Tech though.

The code is MIT.
