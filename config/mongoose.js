const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

//  取得資料庫連線
const db = mongoose.connection

//  連線異常
db.once('error', (req, res) => {
  console.log('mongodb error!')
})
//  連結成功
db.on('open', (req, res) => {
  console.log('mongodb connect!')
})

module.exports = db
