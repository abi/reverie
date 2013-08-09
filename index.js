var debug = require('debug')('test-app')
var path = require('path')
var SimpleApp = require('./lib/SimpleApp')

function App () {
  var self = this

  var opts = {
    name: 'Reverie',
    port: 9999,
    dbPath: path.join(__dirname, './app-db'),
    cookieSecret: 'secret'
  }

  // Call the parent constructor
  SimpleApp.call(self, opts, self.init.bind(self))
}
App.prototype = Object.create(SimpleApp.prototype)

/* Setup app-specific routes and middleware */
App.prototype.init = function () {
  var self = this
  var app = self.app

  app.get('/new', self.auth, function (req, res) {
    res.render('new')
  })

  app.post('/new', self.auth, function (req, res) {
    var now = Date.now()
    var username = req.user.username
    var key = 'post~' + username + '~' + now

    var value = req.body
    value.created = now
    delete value._csrf

    self.db.put(key, value, function (err) {
      res.redirect('/' + username)
    })
  })
}

/* Start the app */
new App()