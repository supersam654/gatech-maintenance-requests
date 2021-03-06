/* globals Chartist XMLHttpRequest */

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

var lineOptions = {
  lineSmooth: false,
  axisY: {
    showLabel: false
  },
  plugins: [
    Chartist.plugins.ctPointLabels()
  ],
  fullWidth: true
}

var barOptions = {
  axisY: {
    showLabel: false
  },
  plugins: [
    Chartist.plugins.ctPointLabels()
  ],
  fullWidth: true
}

function showChartByYear (data) {
  data.by_year.sort(function (a, b) {
    return a.year - b.year
  })

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

  new Chartist.Line('#requests-by-year', chartData, lineOptions)
}

function showChartByMonth (data) {
  data.by_month.sort(function (a, b) {
    return a.month - b.month
  })

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

  new Chartist.Line('#requests-by-month', chartData, lineOptions)
}

function showChartByBuilding (data) {
  data.by_building.sort(function (a, b) {
    return a.count - b.count
  }).reverse()

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

  new Chartist.Bar('#requests-by-building', chartData, barOptions)
}

function showProfaneRequests (data) {
  var totalCount = data.stats.count
  var profaneCount = data.stats.profane_requests

  var nodes = document.querySelectorAll('.total_count')
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].innerText = totalCount
  }

  document.getElementById('profane_count').innerText = profaneCount
  document.getElementById('profane_percent').innerText = (profaneCount * 100 / totalCount).toFixed(4)
}

getData('site/frontend_data/summaries.json', function (data) {
  showChartByYear(data)
  showChartByMonth(data)
  showChartByBuilding(data)
  showProfaneRequests(data)
  doneRendering()
})
