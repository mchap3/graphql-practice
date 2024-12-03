const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  favoriteGenre: {
    type: String,
    required: true,
    minLength: 3
  }
})

module.exports = mongoose.model('User', userSchema)