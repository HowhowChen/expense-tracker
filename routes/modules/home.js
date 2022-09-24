const router = require('express').Router()
const dayjs = require('dayjs')
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', async (req, res, next) => {
  const categories = await Category.find().sort({ _id: 'asc' }).lean()
  Record.find()
    .lean()
    .populate('category_id')
    .then(records => {
      let totalAmount = 0
      records.forEach(record => {
        record.date = dayjs(record.date).format('YYYY-MM-DD')
        totalAmount += Number(record.amount)
      })
      res.render('index', { records, totalAmount, categories })
    })
    .catch(err => next(err))
})

module.exports = router