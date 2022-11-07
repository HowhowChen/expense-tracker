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
    const sortObj = {}

    //  according to sort value, setting sort condition  
    switch (sort) {
      case 'amountDesc':
        sortObj.amountDesc = 1
        sortOption.amount = 'desc'
        break
      case 'amountAsc':
        sortObj.amountAsc = 1
        sortOption.amount = 'asc'
        break
      case 'dateDesc':
        sortObj.dateDesc = 1
        sortOption.date = 'desc'
        break
      case 'dateAsc':
        sortObj.dateAsc = 1
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
    
    await Promise.all([
      Record.find(searchOption).sort(sortOption).limit(limit).skip(offset).populate('category_id').lean(),
      Category.find().sort({ _id: 'asc' }).lean(),
      Record.find(searchOption).sort(sortOption).lean(),
      Record.countDocuments(searchOption).lean()
    ])
      .then(([records, categories, totalRecords, total]) => {
        //  add selected attribute
        categories.map(categories => {
          if (categories.name == category) {
            categories.selected = 'selected'
          }
        })

        //  setting date format and count totalAmout
        let totalAmount = 0
        totalRecords.forEach(record => totalAmount += Number(record.amount))
        records.forEach(record => record.date = dayjs(record.date).format('YYYY-MM-DD'))
        
        res.render('index', { records, totalAmount, categories, sortObj, pagination: getPagination(limit, page, total, category, sort) })
      })
  } catch (err) {
    next(err)
  }
})

module.exports = router
