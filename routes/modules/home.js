const router = require('express').Router()
const dayjs = require('dayjs')
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', async (req, res, next) => {
  try {
    const user_id = req.user._id
    const categories = await Category.find().sort({ _id: 'asc' }).lean()
    const records = await Record.find({ user_id }).populate('category_id').lean()
    let totalAmount = 0
    records.forEach(record => {
      record.date = dayjs(record.date).format('YYYY-MM-DD')
      totalAmount += Number(record.amount)
    })
    res.render('index', { records, totalAmount, categories })
  } catch (e) {
    next(e)
  }
})

module.exports = router
