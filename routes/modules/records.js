const router = require('express').Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const { recordValidator } = require('../../middleware/validatorHandler')

//  get a new record page
router.get('/new', (_, res) => {
  res.render('new')
})

// create a new record
router.post('/new', recordValidator, async (req, res, next) => {
  try {
    const user_id = req.user._id
    const { name, date, category, amount } = req.body
    
    const categoryData = await Category.findOne({ name: category }).lean()
    await Record.create({
      name,
      date,
      category_id: categoryData._id,
      amount,
      user_id
    })
    res.redirect('/')
  } catch(err) {
    next(err)
  }
})

//  get edit record page
router.get('/:id/edit', async (req, res, next) => {
  try {
    const user_id = req.user._id
    const _id = req.params.id

    await Promise.all([
      Category.find().sort({ _id: 'asc' }).lean(),
      Record.findOne({ _id, user_id }).lean().populate('category_id').lean()
    ])
      .then(([categories, record]) => {
        record.date = record.date.toISOString().slice(0, 10)  //  轉字串並取前10位
        res.render('edit', { record, categories })
      })
  } catch (err) {
    next(err)
  }
})

//  edit a record
router.put('/:id', recordValidator, async (req, res, next) => {
  try {
    const user_id = req.user._id
    const _id = req.params.id
    const { name, date, category, amount } = req.body

    const categoryData = await Category.findOne({ name: category }).lean()
    await Record.findOneAndUpdate({ _id, user_id }, { name, date, category_id: categoryData._id, amount })
    res.redirect('/')
  } catch (err) {
    next(err)
  }
})

//  delete a record
router.delete('/:id', async (req, res, next) => {
  try {
    const user_id = req.user._id
    const _id = req.params.id
    await Record.findByIdAndDelete({ _id, user_id })
    res.redirect('/')
  } catch (err) {
    next(err)
  }
})

module.exports = router
