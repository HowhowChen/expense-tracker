const router = require('express').Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

//  get a new record page
router.get('/new', (req, res) => {
  res.render('new')
})

// create a new record
router.post('/new', async (req, res, next) => {
  const { name, date, category, amount } = req.body
  const user_id = req.user._id

  try {
    const categoryData = await Category.findOne({ name: category }).lean()
    await Record.create({
      name,
      date,
      category_id: categoryData,
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
  const _id = req.params.id
  try {
    const record = await Record.findOne({ _id }).lean().populate('category_id').lean()
    record.date = record.date.toISOString().slice(0, 10)  //  轉字串並取前10位
    res.render('edit', { record })
  } catch (e) {
    next(e)
  }
})

//  edit a record
router.put('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id
    const { name, date, category, amount } = req.body
    const categoryData = await Category.findOne({name: category}).lean()
    await Record.findOneAndUpdate({ _id }, { name, date, category_id: categoryData._id, amount })
    res.redirect('/')
  } catch (e) {
    next(e)
  }
})

//  delete a record
router.delete('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id
    await Record.findByIdAndDelete({ _id })
    res.redirect('/')
  } catch (e) {
    next(e)
  }
})

module.exports = router
