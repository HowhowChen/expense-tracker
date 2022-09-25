const router = require('express').Router()
const dayjs = require('dayjs')
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', async (req, res, next) => {
  try {
    const user_id = req.user._id
    const { category, sort } = req.query
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
    
    const categories = await Category.find().sort({ _id: 'asc' }).lean()
    const records = await Record.find(searchOption).sort(sortOption).populate('category_id').lean()
   
    //  add selected attribute
    categories.map(categories => {
      if (categories.name == category) {
        categories.selected = 'selected'
      }
    })

    //  setting date format and count totalAmout
    let totalAmount = 0
    records.forEach(record => {
      record.date = dayjs(record.date).format('YYYY-MM-DD')
      totalAmount += Number(record.amount)
    })
    
    res.render('index', { records, totalAmount, categories, sortObj })
  } catch (e) {
    next(e)
  }
})

module.exports = router
