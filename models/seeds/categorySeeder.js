if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const categoryJson = require('./category.json')
const Category = require('../category')
const db = require('../../config/mongoose')

db.once('open', async () => {
  await Category.create(categoryJson)
  console.log('finish category seeds and db close')
  db.close()
  process.exit()
})
