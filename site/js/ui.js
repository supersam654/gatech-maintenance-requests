(function (window, document) {
  var layout = document.getElementById('layout')
  var menu = document.getElementById('menu')
  var menuLink = document.getElementById('menuLink')

  function toggleClass (element, className) {
    var classes = element.className.split(/\s+/)
    var originalLength = classes.length

    for (var i = 0; i < classes.length; i++) {
      if (classes[i] === className) {
        classes.splice(i, 1)
        break
      }
    }
    // The className is not found
    if (originalLength === classes.length) {
      classes.push(className)
    }

    element.className = classes.join(' ')
  }

  menuLink.onclick = function (e) {
    var active = 'active'

    e.preventDefault()
    toggleClass(layout, active)
    toggleClass(menu, active)
    toggleClass(menuLink, active)
  }
}(this, this.document))

function doneRendering () {
  setTimeout(function () {
    smoothScroll.init()
    gumshoe.init()
  }, 0)
}
