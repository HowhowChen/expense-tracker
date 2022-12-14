const mongoose = require('mongoose')
const { Schema, model } = mongoose
const recordSchma = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    index: true,
    required: true
  }
})

module.exports = model('Record', recordSchma)
