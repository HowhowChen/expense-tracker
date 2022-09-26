const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const records = require('./modules/records')
const search = require('./modules/search')
const users = require('./modules/users')
const auth = require('./modules/auth')
const forgotPassword = require('./modules/forgot-password')

const { authenticator } = require('../middleware/auth')

router.use('/users', users)
router.use('/auth', auth)
router.use('/forgot-password', forgotPassword)
router.use('/search', authenticator, search)
router.use('/records', authenticator, records)
router.use('/', authenticator, home)

//  get a 404 page
router.get('*', (req, res) => {
  res.locals.layout = 'space.hbs'
  res.status(404).render('error404', { error: `We can't find this page.` })
})

module.exports = router
