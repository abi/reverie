var md5 = require('MD5')
var mongoose = require('mongoose')

var User = mongoose.Schema({
  name: String,
  username: { type: String, index: true },
  email: String,
  password: String
})

User.virtual('firstName').get(function () {
  return this.name.split(' ')[0]
})

User.virtual('gravatarUrl').get(function() {
  var hash = md5(this.email.trim().toLowerCase())
  return '//www.gravatar.com/avatar/' + hash + '?size=32&default=blank'
})

var Post = mongoose.Schema({
  created: { type: Date, default: Date.now },
  contents: String,
  title: { type: String, default: ''},
  user: {type: mongoose.Schema.Types.ObjectId, required: true, index: true}
})

exports.User = mongoose.model('User', User)
exports.Post = mongoose.model('Post', Post)