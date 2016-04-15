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

function addChart (chartId, chartType, chartData, chartOptions) {
  var ctx = document.getElementById(chartId).getContext('2d')
  return new Chart(ctx)[chartType](chartData, chartOptions)
}

function sortByYear (data) {
  var years = {}
  for (var yearMonth in data.by_month) {
    var year = yearMonth.split('-')[0]
    years[year] = years[year] || 0
    years[year] += data.by_month[yearMonth]
  }

  var sortableYears = []
  for (var year in years) {
    sortableYears.push([year, years[year]])
  }
  sortableYears.sort()

  var labels = []
  var dataset = []
  for (var i = 0; i < sortableYears.length; i++) {
    var year = sortableYears[i]
    labels.push(year[0])
    dataset.push(year[1])
  }

  return {
    labels: labels,
    datasets: [{label: 'Requests by Year', data: dataset}]
  }
}

function sortByMonth (data) {
  var months = {}
  for (var yearMonth in data.by_month) {
    var month = yearMonth.split('-')[1]
    months[month] = months[month] || 0
    months[month] += data.by_month[yearMonth]
  }

  var sortableMonths = []
  for (var month in months) {
    sortableMonths.push([month, months[month]])
  }
  sortableMonths.sort()

  var labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var dataset = []
  for (var i = 0; i < sortableMonths.length; i++) {
    var month = sortableMonths[i]
    dataset.push(month[1])
  }

  return {
    labels: labels,
    datasets: [{label: 'Requests by Month', data: dataset}]
  }
}

function sortByBuilding (data) {
  var buildings = {}
  for (var yearMonth in data.by_building) {
    for (var building in data.by_building[yearMonth]) {
      buildings[building] = buildings[building] || 0
      buildings[building] += data.by_building[yearMonth][building]
    }
  }

  var sortableBuildings = []
  for (var building in buildings) {
    sortableBuildings.push([building, buildings[building]])
  }
  sortableBuildings.sort()

  var labels = []
  var dataset = []
  for (var i = 0; i < sortableBuildings.length; i++) {
    var building = sortableBuildings[i]
    labels.push(building[0])
    dataset.push(building[1])
  }

  return {
    labels: labels,
    datasets: [{label: 'Requests by Month', data: dataset}]
  }
}

getData('summaries.json', function (data) {
  addChart('requestsByYear', 'Bar', sortByYear(data))
  addChart('requestsByMonth', 'Bar', sortByMonth(data))
  console.log(data)
  addChart('requestsByBuilding', 'Bar', sortByBuilding(data))
})
