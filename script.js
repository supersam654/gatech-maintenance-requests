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
  data.by_year.sort(function (a, b) {
    return a.year < b.year
  }).reverse()

  var labels = []
  var dataset = []
  for (var i = 0; i < data.by_year.length; i++) {
    var year = data.by_year[i]
    labels.push(year.year)
    dataset.push(year.count)
  }

  return {
    labels: labels,
    datasets: [{label: 'Requests by Year', data: dataset}]
  }
}

function sortByMonth (data) {
  data.by_month.sort(function (a, b) {
    return a.month < b.month
  }).reverse()

  var labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var dataset = []
  for (var i = 0; i < data.by_month.length; i++) {
    var month = data.by_month[i]
    dataset.push(month.count)
  }

  return {
    labels: labels,
    datasets: [{label: 'Requests by Month', data: dataset}]
  }
}

function sortByBuilding (data) {
  data.by_building.sort(function (a, b) {
    return a.building < b.building
  }).reverse()

  var labels = []
  var dataset = []
  for (var i = 0; i < data.by_building.length; i++) {
    var building = data.by_building[i]
    labels.push(building.building)
    dataset.push(building.count)
  }

  return {
    labels: labels,
    datasets: [{label: 'Requests by Building', data: dataset}]
  }
}

getData('summaries.json', function (data) {
  addChart('requestsByYear', 'Bar', sortByYear(data))
  addChart('requestsByMonth', 'Bar', sortByMonth(data))
  console.log(data)
  addChart('requestsByBuilding', 'Bar', sortByBuilding(data))
})
