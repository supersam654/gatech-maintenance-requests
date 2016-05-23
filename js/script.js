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

function showChartByYear (data) {
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

  var chartData = {
    labels: labels,
    series: [dataset]
  }

  new Chartist.Bar('#requests-by-year', chartData)
}

function showChartByMonth (data) {
  data.by_month.sort(function (a, b) {
    return a.month < b.month
  }).reverse()

  var labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var dataset = []
  for (var i = 0; i < data.by_month.length; i++) {
    var month = data.by_month[i]
    dataset.push(month.count)
  }

  var chartData = {
    labels: labels,
    series: [dataset]
  }

  new Chartist.Bar('#requests-by-month', chartData)
}

function showChartByBuilding (data) {
  data.by_building.sort(function (a, b) {
    return a.count < b.count
  })

  var labels = []
  var dataset = []
  // Cap chart at top 10 biggest problem buildings.
  var maxBuildings = Math.min(10, data.by_building.length)
  for (var i = 0; i < maxBuildings; i++) {
    var building = data.by_building[i]
    labels.push(building.building)
    dataset.push(building.count)
  }

  var chartData = {
    labels: labels,
    series: [dataset]
  }

  new Chartist.Bar('#requests-by-building', chartData)
}

getData('summaries.json', function (data) {
  showChartByYear(data)
  showChartByMonth(data)
  showChartByBuilding(data)
})
