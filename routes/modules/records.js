const router = require('express').Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', (req, res) => {
  res.render('new')
})

//  get edit record page
router.get('/:id/edit', (req, res, next) => {
  const _id = req.params.id
  return Record.findOne({ _id })
    .populate('category_id')
    .lean()
    .then(record => {
      record.date = record.date.toISOString().slice(0, 10)  //  取前10位
      res.render('edit', { record })
    })
    .catch(err => next(err))
})
module.exports = router
