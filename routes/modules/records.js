const router = require('express').Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

//  get a new record page
router.get('/new', (req, res) => {
  res.render('new')
})

// create a new record
router.post('/new', async (req, res, next) => {
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
  } catch(e) {
    next(e)
  }
})

//  get edit record page
router.get('/:id/edit', async (req, res, next) => {
  try {
    const user_id = req.user._id
    const _id = req.params.id
    const record = await Record.findOne({ _id, user_id }).lean().populate('category_id').lean()
    record.date = record.date.toISOString().slice(0, 10)  //  轉字串並取前10位
    res.render('edit', { record })
  } catch (e) {
    next(e)
  }
})

//  edit a record
router.put('/:id', async (req, res, next) => {
  try {
    const user_id = req.user._id
    const _id = req.params.id
    const { name, date, category, amount } = req.body
    const categoryData = await Category.findOne({ name: category, user_id }).lean()
    await Record.findOneAndUpdate({ _id }, { name, date, category_id: categoryData._id, amount })
    res.redirect('/')
  } catch (e) {
    next(e)
  }
})

//  delete a record
router.delete('/:id', async (req, res, next) => {
  try {
    const user_id = req.user._id
    const _id = req.params.id
    await Record.findByIdAndDelete({ _id, user_id })
    res.redirect('/')
  } catch (e) {
    next(e)
  }
})

module.exports = router
