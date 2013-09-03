var concat = require('concat-stream')
var debug = require('debug')('test-app')
var marked = require('marked')
var models = require('./models')
var path = require('path')
var SimpleApp = require('./lib/SimpleApp')
var timeago = require('timeago')

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

  app.locals.timeago = function (ts) {
    return timeago(new Date(ts))
  }

  app.locals.markdown = function (str) {
    return marked(str)
  }

  app.get('/new', self.auth, function (req, res) {
    res.render('new')
  })

  app.post('/new', self.auth, function (req, res) {
    var now = Date.now()

    var post = new models.Post({
      contents: req.body.contents,
      user: req.user
    })

    post.save(function (err, post) {
      if (err) {
        next(err)
      } else {
        res.redirect('/' + req.user.username)
      }
    })
  })

  app.get('/:username', function (req, res) {
    var username = req.params.username
    models.User.findOne({username: username}, function (err, blogger) {
      if (blogger === null) {
        res.render('404')
      } else if (err) {
        res.send(500, {error: err})
      } else {
        models.Post
          .find({user: blogger})
          .sort('-created').limit(10)
          .exec(function (err, posts) {
          res.render('blog', {posts: posts, blogger: blogger})
        })
      }
    })
  })
}

/* Start the app */
new App()