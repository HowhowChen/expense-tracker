const express = require('express')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('new')
})

router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  res.render('edit')
})
module.exports = router
