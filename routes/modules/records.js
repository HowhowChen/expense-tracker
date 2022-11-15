const router = require('express').Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const { amountValidator } = require('../../helpers/validation-helpers')

//  get a new record page
router.get('/new', (_, res) => {
  res.render('new')
})

// create a new record
router.post('/new', async (req, res, next) => {
  try {
    const user_id = req.user._id
    const { name, date, category, amount } = req.body
    const errors = []
    //  prevent use post request ignore client limit 
    if (!name || !date || !category || !amount) errors.push({ msg: '每一項都必填!' })
    
    //  驗證amount
    if (!amountValidator(amount)) errors.push({ msg: '金額不接受小數點和負數!' })

    //  if error
    if (errors.length) {
      return res.render('new', {
        errors,
        name,
        date,
        category,
        amount
      })
    }
    
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
router.put('/:id', async (req, res, next) => {
  try {
    const user_id = req.user._id
    const _id = req.params.id
    const { name, date, category, amount } = req.body
    const errors = []
    //  prevent use post request ignore client limit 
    if (!name || !date || !category || !amount) errors.push({ msg: '每一項都必填!' })
    
    //  驗證amount
    if (!amountValidator(amount)) errors.push({ msg: '金額不接受小數點和負數!' })

    //  if error
    if (errors.length) {
      req.flash('errors', errors)
      return res.redirect(`/records/${_id}/edit`)
    }

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
