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

function makeCodeTableRow (codeData) {
  var element = document.createElement('tr')
  element.appendChild(makeTableCell(codeData.code))
  element.appendChild(makeTableCell(codeData.count))
  element.appendChild(makeTableCell(codeData.description))
  element.appendChild(makeTableCell(codeData.sample_request))

  return element
}

function fillTableWithCodes (data) {
  var tbody = document.getElementById('codes-body')
  var isOdd = false
  for (category in data) {
    for (code in data[category]) {
      // {"CRP009": {"count": 216, "category": "CRP", "code": "CRP009", "description": "Ceiling problems (e.g. paint chipping)", "sample_request": "The panel behind the kitchen sink is badly warped. Could it be fixed? Thank you!", "first_date": {"$date": 1113782400000}, "last_date": {"$date": 1461556800000}}
      var tableRow = makeCodeTableRow(data[category][code])
      if (isOdd) {
        tableRow.classList.add('pure-table-odd')
      }
      isOdd = !isOdd

      tbody.appendChild(tableRow)
    }
  }
}

getData('frontend_data/categories.json', function (data) {
  fillTableWithCodes(data)
})
