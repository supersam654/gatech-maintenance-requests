#!/usr/bin/env python

import requests
import json
from bs4 import BeautifulSoup as BS

START_WORK_ORDER = 0
MAX_FAILS = 10

def get_row_val(table, row_num, index):
  return table.find_all('tr')[row_num].find_all('td')[index].text.strip()

def scrape_request(html):
  soup = BS(html, 'lxml')
  table = soup.find('table')

  try:
    data = {}
    data['work_request'] = get_row_val(table, 0, 4).split('\n')[0]
    data['building'] = get_row_val(table, 4, 1)
    data['location_id'] = get_row_val(table, 4, 3)
    data['accept_date'] = get_row_val(table, 5, 1)
    data['work_order'] = get_row_val(table, 5, 3)
    data['reject_date'] = get_row_val(table, 6, 1)
    data['room_description'] = get_row_val(table, 6, 3)
    data['reject_reason'] = get_row_val(table, 7, 1)
    data['requested_action'] = get_row_val(table, 9, 1)
    data['status'] = get_row_val(table, 3, 1).split('\n')[-1].strip().split(' ')[-1]

    return data
  except IndexError:
    return None

def scrape_order(html):
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
    data['request_time'] = get_row_val(table, 10, 3)
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

def download_request(request_number):
  response = requests.post('http://128.61.165.203/query_wo.cgi', {'Search': 'WR', 'WorkOrderNumber': request_number})
  if response.ok:
    return response.text
  else:
    return None

def download_order(order_number):
  response = requests.get('http://128.61.165.203/query_wo_results.html?%s' % order_number)
  if response.ok:
    return response.text
  else:
    return None



def main():
  crawled_file = open('crawled.txt', 'a+')
  crawled_file.seek(0)
  # output_file is delimited by the newline character. Each line consists of a json blob of data.
  output_file = open('data.txt', 'a+')

  crawled_values = set()
  for line in crawled_file:
    crawled_values.add(line.strip())

  consecutive_failures = 0

  i = START_WORK_ORDER
  try:
    while True:
      i_as_string = str(i)
      if i_as_string not in crawled_values:
        print('Requesting Work Request: %s' % i_as_string)
        work_request = download_request(i_as_string)
        if work_request:
          request_data = scrape_request(work_request)
          if request_data:
            work_order_number = request_data['work_order']
            if work_order_number:
              print('Requesting Work Order: %s' % work_order_number)
              work_order = download_order(work_order_number)
              order_data = scrape_order(work_order)
            else:
              order_data = None
            print('Scraped order (%s): %s' % (work_order_number, order_data))
            print('Scraped %s: %s' % (i_as_string, request_data))
            request_data['order_data'] = order_data
            json.dump(request_data, output_file)
            output_file.write('\n')
            consecutive_failures = 0
          else:
            print('Issue scraping %s.' % i_as_string)
            consecutive_failures += 1
        else:
          print('Network issue prevented requesting %s. Aborting' % i_as_string)
          break
      # Always record what pages we have crawled, even if unsuccessful.
      crawled_file.write(str(i) + '\n')
      if consecutive_failures >= MAX_FAILS:
        print('Too many failures. Probably at the end.')
        break

      i += 1
  finally:
    crawled_file.close()
    output_file.close()

if __name__ == '__main__':
  main()
