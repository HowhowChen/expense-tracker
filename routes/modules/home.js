const router = require('express').Router()
const dayjs = require('dayjs')
const Record = require('../../models/record')
const Category = require('../../models/category')
const { getOffset, getPagination, DEFAULT_LIMIT } = require('../../helpers/pagination-helpers')

router.get('/', async (req, res, next) => {
  try {
    const user_id = req.user._id
    const page = Number(req.query.page) || 1 // currentpage
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // diplay recors count per page
    const offset = getOffset(limit, page)
  
    await Promise.all([
      Record.find({ user_id }).limit(limit).skip(offset).populate('category_id').lean(),
      Category.find().sort({ _id: 'asc' }).lean(),
      Record.find({ user_id }).lean(),
      Record.countDocuments({ user_id }).lean()
    ])
      .then(([records, categories, totalRecords, total]) => {
        //  setting date format and count totalAmout
        let totalAmount = 0
        totalRecords.forEach(record => totalAmount += Number(record.amount))
        records.forEach(record => record.date = dayjs(record.date).format('YYYY-MM-DD'))

        res.render('index', { records, totalAmount, categories, pagination: getPagination(limit, page, total) })
      })
  } catch (e) {
    next(e)
  }
})

module.exports = router
