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
    
    //  對資料庫平行請求
    const [records, categories, totalRecords, total] = await Promise.all([
      Record.find({ user_id }).limit(limit).skip(offset).populate('category_id').lean(),  //  透過limie skip後的分頁資料
      Category.find().sort({ _id: 'asc' }).lean(),  //  資料庫種類表
      Record.find({ user_id }).lean(),  //  所有record資料
      Record.countDocuments({ user_id }).lean() //  record總數量
    ])
    
     //  setting date format and count totalAmout
    let totalAmount = 0
    totalRecords.forEach(record => totalAmount += Number(record.amount))
    records.forEach(record => record.date = dayjs(record.date).format('YYYY-MM-DD'))

    res.render('index', { records, totalAmount, categories, pagination: getPagination(limit, page, total) })
  } catch (err) {
    next(err)
  }
})

module.exports = router
