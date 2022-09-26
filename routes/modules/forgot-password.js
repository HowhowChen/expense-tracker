const router = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const JWT_SECRET = process.env.JWT_SECRET
const sendResetPasswordEmail = require('../../helpers/email-helper')

// get a forgot-password page
router.get('/', (req, res) => {
  res.render('forgot-password')
})

// send reset email
router.post('/', async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      req.flash('error', '帳戶不存在!')
      res.render('forgot-password', { email })
    }
    // create a one time link valid for 5 minutes
    const secret = JWT_SECRET + user.password
    const payload = {
      email,
      id: user._id
    }
    const token = jwt.sign(payload, secret, { expiresIn: '5m' })
    const link = `http://${req.headers.host}/forgot-password/reset-password/${user._id}/${token}`
    //  send email link
    await sendResetPasswordEmail(user.name, email, link)

    req.flash('success_msg', '發送成功!')
    res.render('forgot-password', { email })
  } catch (e) {
    next(e)
  }
})

module.exports = router
