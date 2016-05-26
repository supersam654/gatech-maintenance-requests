/* global XMLHttpRequest, Chartist, barOptions */

function getData (jsonUrl, cb) {
  var request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      var data = JSON.parse(request.responseText)
      cb(data)
    }
  }
  request.open('GET', jsonUrl, true)
  request.overrideMimeType('application/json')
  request.send()
}

function makeTableCell (text) {
  var cell = document.createElement('td')
  cell.innerText = text
  return cell
}

function makeCodeTableHead () {
  var table = document.createElement('table')
  table.classList.add('pure-table')
  table.innerHTML = '<thead><tr>' +
      '<th>Code</th>' +
      '<th>Count</th>' +
      '<th>First Occurrence</th>' +
      '<th>Last Occurrence</th>' +
      '<th>Description</th>' +
      '<th>Sample</th>' +
      '</th></thead>'
  return table
}

function makeCodeTableRow (codeData) {
  var firstUsage = new Date(codeData.first_date.$date)
  var lastUsage = new Date(codeData.last_date.$date)
  var element = document.createElement('tr')
  // Used for jumping to a particular code in a table.
  element.id = codeData.code

  element.appendChild(makeTableCell(codeData.code))
  element.appendChild(makeTableCell(codeData.count))
  element.appendChild(makeTableCell(firstUsage.toDateString()))
  element.appendChild(makeTableCell(lastUsage.toDateString()))
  element.appendChild(makeTableCell(codeData.description))
  element.appendChild(makeTableCell(codeData.sample_request))

  return element
}

function getCategories (codeData) {
  var categories = Object.keys(codeData).sort()

  return categories
}

function makeCodeTables (data, container) {
  var categories = getCategories(data)
  for (var i = 0; i < categories.length; i++) {
    var category = categories[i]
    var codeData = data[category]
    var table = makeCodeTableHead()
    table.appendChild(makeCodeTableBody(codeData))
    var header = document.createElement('h3')
    header.innerText = category

    container.appendChild(document.createElement('br'))
    container.appendChild(header)
    container.appendChild(table)
  }
}

function makeCodeTableBody (categoryData) {
  var tbody = document.createElement('tbody')
  var isOdd = false
  var codes = Object.keys(categoryData).sort()
  for (var i = 0; i < codes.length; i++) {
    var code = codes[i]
    var tableRow = makeCodeTableRow(categoryData[code])
    if (isOdd) {
      tableRow.classList.add('pure-table-odd')
    }
    isOdd = !isOdd

    tbody.appendChild(tableRow)
  }
  return tbody
}

function makeTopCodesSection (data, container) {
  var MAX_CODES = 10
  var codes = []
  var totalCount = 0
  for (var category in data) {
    for (var code in data[category]) {
      codes.push(data[category][code])
      totalCount += data[category][code].count
    }
  }

  codes.sort(function (a, b) {
    return a.count - b.count
  }).reverse()
  codes = codes.slice(0, MAX_CODES)

  var labels = []
  var series = []
  var topTenCount = 0
  for (var i = 0; i < codes.length; i++) {
    var codeData = codes[i]
    labels.push(codeData.code)
    series.push(codeData.count)
    topTenCount += codeData.count
  }
  // Add a pretty chart.
  var chartData = {
    labels: labels,
    series: [series]
  }

  // Make the chart.
  new Chartist.Bar('#top-codes-chart', chartData, barOptions)

  // Fill in any missing numbers.
  document.getElementById('top_10_count').innerText = topTenCount
  document.getElementById('top_10_percent').innerText = (topTenCount * 100 / totalCount).toFixed(1)

  // Add the data table.
  var table = makeCodeTableHead()
  table.appendChild(makeCodeTableBody(codes))
  container.appendChild(table)
}

function showChartByCodesPerYear (data) {
  var codesAdded = {}
  var codesRemoved = {}
  for (var category in data) {
    var categoryData = data[category]
    for (var code in categoryData) {
      var codeData = categoryData[code]
      var createdYear = new Date(codeData.first_date.$date).getFullYear()
      // Not used the year _after_ it was last seen.
      var discontinuedYear = new Date(codeData.last_date.$date).getFullYear() + 1

      codesAdded[createdYear] = codesAdded[createdYear] || []
      codesRemoved[discontinuedYear] = codesRemoved[discontinuedYear] || []
      codesAdded[createdYear].push(code)
      codesRemoved[discontinuedYear].push(code)
    }
  }

  var firstYear = Math.min.apply(null, Object.keys(codesAdded))
  var lastYear = new Date().getFullYear()

  var labels = []
  var added = []
  var removed = []
  for (var year = firstYear; year <= lastYear; year++) {
    labels.push(year)
    var addedLength = 0
    var removedLength = 0
    if (codesAdded[year]) {
      addedLength = codesAdded[year].length
    }
    if (codesRemoved[year]) {
      removedLength = -codesRemoved[year].length
    }
    added.push(addedLength)
    removed.push(removedLength)
  }

  var chartData = {
    labels: labels,
    series: [added, removed]
  }

  new Chartist.Bar('#codes-by-year', chartData)
}

getData('site/frontend_data/categories.json', function (data) {
  makeCodeTables(data, document.getElementById('categories'))
  makeTopCodesSection(data, document.getElementById('top-codes'))
  showChartByCodesPerYear(data)
  doneRendering()
})
