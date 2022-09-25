const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const records = require('./modules/records')
const search = require('./modules/search')

router.use('/search', search)
router.use('/records', records)
router.use('/', home)

//  get a 404 page
router.get('*', (req, res) => {
  res.locals.layout = 'space.hbs'
  res.status(404).render('error404', { error: `We can't find this page.` })
})

module.exports = router
