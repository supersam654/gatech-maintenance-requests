function getData (jsonUrl, cb) {
  var request = new XMLHttpRequest()
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
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
  element.appendChild(makeTableCell(codeData.code))
  element.appendChild(makeTableCell(codeData.count))
  element.appendChild(makeTableCell(firstUsage.toDateString()))
  element.appendChild(makeTableCell(lastUsage.toDateString()))
  element.appendChild(makeTableCell(codeData.description))
  element.appendChild(makeTableCell(codeData.sample_request))

  return element
}

function getCategories (codeData) {
  categories = []
  for (var category in codeData) {
    categories.push(category)
  }
  categories.sort()

  return categories
}

function makeCodeTables (data) {
  var categories = getCategories(data)
  var container = document.getElementById('categories')
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
  for (code in categoryData) {
    var tableRow = makeCodeTableRow(categoryData[code])
    if (isOdd) {
      tableRow.classList.add('pure-table-odd')
    }
    isOdd = !isOdd

    tbody.appendChild(tableRow)
  }
  return tbody
}

getData('frontend_data/categories.json', function (data) {
  makeCodeTables(data)
})
