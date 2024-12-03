const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  born: Number
})

module.exports = mongoose.model('Author', authorSchema)