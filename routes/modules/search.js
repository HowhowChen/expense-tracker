const router = require('express').Router()
const dayjs = require('dayjs')
const Record = require('../../models/record')
const Category = require('../../models/category')
const { getOffset, getPagination, DEFAULT_LIMIT } = require('../../helpers/pagination-helpers')

router.get('/', async (req, res, next) => {
  try {
    const user_id = req.user._id
    const { sort } = req.query
    const category = req.query.category || '全部'
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    const searchOption = {}
    const sortOption = {}

    //  according to sort value, setting sort condition  
    switch (sort) {
      case 'amountDesc':
        sortOption.amount = 'desc'
        break
      case 'amountAsc':
        sortOption.amount = 'asc'
        break
      case 'dateDesc':
        sortOption.date = 'desc'
        break
      case 'dateAsc':
        sortOption.date = 'asc'
        break
      default:
        break
    }
    
    //  according to category value, setting search option
    switch (category) {
      case '全部':
        searchOption.user_id = user_id
        break
      default:
        const categoryData = await Category.findOne({ name: category }).lean()
        searchOption.category_id = categoryData._id
        searchOption.user_id = user_id 
        break
    }
    
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
    
    res.render('index', { records, totalAmount, categories, pagination: getPagination(limit, page, total, category, sort) })
  } catch (err) {
    next(err)
  }
})

module.exports = router
