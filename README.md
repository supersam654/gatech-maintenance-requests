# Georgia Tech Work Orders

Check it out at http://supersam654.github.io/gatech-maintenance-requests/

This project is an analysis of all maintenance requests accepted by the Georgia Tech Department of Housing since 10/12/2005. This is the earliest time I can find work orders (GH-1185).

## Viewing the Data

All of the data has been `mongodump`ed very typically into the `dump` directory. See `export_mongo.sh` for the exact command used to generate the dump.

## Dependencies

* Python 3
* Mongo 3
* lxml (try `pip install lxml` and see the following section if that doesn't work)

    pip install -r requirements.txt

### Installing lxml on Windows

`lxml` is a lenient HTML parser that is required to reasonably parse the maintenence request pages. Specifically, the page for Work Orders has horribly invalid markup that is not properly handled by the built-in `html.parser` parser. If you have Visual Studio installed, `pip install lxml` should work for you. Otherwise:

* Download a suitable package from http://www.lfd.uci.edu/~gohlke/pythonlibs/#lxml (make sure to grab a package that corresponds with your version of python)
* Run `pip install /path/to/lxml-x.x.x-cpxx-cpxxm-win_xxx.whl`

### What about Python 2?

From a technical standpoint, doing unicode string conversions with Python 2 and Python 3 is flat out painful.

From a religious standpoint, 2016 is coming to a close and people seriously need to move to Python 3.

## Grabbing the latest data

To get more data, have a local `mongod` instance running. Then run `python scraper.py`. If you want to be a nice person, run `export_mongo.sh` and commit that too.

## License

I'm not sure what license the actual work order data is under. I have been unable to find any information on the rights related to this data. I'd assume that it's copyright Georgia Tech though.

The code is MIT.
