#!/usr/bin/env python

import requests
import json
from bs4 import BeautifulSoup as BS

# Empirical checking has found that this is the lowest value that is available online.
START_WORK_ORDER = 1185

def get_row_val(table, row_num, index):
  return table.find_all('tr')[row_num].find_all('td')[index].text.strip()

def scrape_page(html):
  soup = BS(html)
  table = soup.find('table')

  try:
    data = {}
    data['work_order'] = get_row_val(table, 0, 4)
    data['date_closed']= get_row_val(table, 4, 3)
    data['campus'] = get_row_val(table, 8, 1)
    data['reference_number'] = get_row_val(table, 8, 3)
    data['building'] = get_row_val(table, 9, 1)
    data['location_id'] = get_row_val(table, 9, 3)
    data['request_date'] = get_row_val(table, 10, 1)
    data['request_time'] = get_row_val(table, 9, 3)
    data['status'] = get_row_val(table, 11, 1)
    data['shop'] = get_row_val(table, 11, 3)
    data['code'] = get_row_val(table, 12, 1)
    data['description'] = get_row_val(table, 12, 3)
    data['request'] = get_row_val(table, 14, 1)
    data['action'] = get_row_val(table, 15, 1)
    data['completed'] = get_row_val(table, 17, 0) == 'Requested action has been completed'

    return data
  except IndexError:
    return None

def main():
  crawled_file = open('crawled.txt', 'a+')
  # output_file is delimited by the newline character. Each line consists of a json blob of data.
  output_file = open('data.txt', 'a+')

  crawled_values = set()
  for line in crawled_file:
    crawled_values.add(line)

  consecutive_failures = 0

  i = START_WORK_ORDER
  try:
    while True:
      i_as_string = str(i)
      if i_as_string not in crawled_values:
        i_as_string = 'GH-' + i_as_string
        print('Requesting Work Order: %s' % i_as_string)
        response = requests.get('http://128.61.165.203/query_wo_results.html?%s' % i_as_string)
        if response.ok:
          data = scrape_page(response.text)
          if data:
            json.dump(data, output_file)
            output_file.write('\n')
            crawled_file.write(str(i) + '\n')
            print('Scraped %s: %s' % (i_as_string, data))
            consecutive_failures = 0
          else:
            print('Issue scraping %s.' % i_as_string)
            consecutive_failures += 1
            if consecutive_failures >= 10:
              print('Too many failures. Probably at the end.')
              break
        else:
          print('Network issue prevented requesting %s. Aborting' % i_as_string)
          break
      i += 1
  finally:
    crawled_file.close()
    output_file.close()

if __name__ == '__main__':
  main()