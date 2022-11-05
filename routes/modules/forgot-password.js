const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const JWT_SECRET = process.env.JWT_SECRET
const sendResetPasswordEmail = require('../../helpers/email-helpers')

// get a forgot-password page
router.get('/', (req, res) => {
  res.render('forgot-password')
})

// send reset email
router.post('/', async (req, res, next) => {
  try {
    const { email } = req.body
    
    if (!email) {
      req.flash('error', '必填選項!')
      return res.redirect('/forgot-password')
    }

    const user = await User.findOne({ email })
    if (!user) {
      req.flash('error', '帳戶不存在!')
      req.flash('email', email)
      return res.redirect('/forgot-password')
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
    res.redirect('/forgot-password')
  } catch (e) {
    next(e)
  }
})

//  get a reset-password page
router.get('/reset-password/:id/:token', async (req, res, next) => {
  try {
    const { id, token } = req.params
    const user = await User.findById(id)
    if (!user) return next(e)
    //  authenticate the token
    const secret = JWT_SECRET + user.password
    jwt.verify(token, secret)
    res.render('reset-password', { id, token })
  } catch (e) {
    next(e)
  }
})

// reset password
router.post('/reset-password/:id/:token', async (req, res, next) => {
  try {
    const { id, token } = req.params
    const { password, confirmPassword } = req.body
    
    //  authenticate user
    const user = await User.findById(id)
    if (!user) return next(e)
   
    //  authenticate the token
    const secret = JWT_SECRET + user.password
    jwt.verify(token, secret)
    
    const errors = []
    if (!password || !confirmPassword) {
      errors.push({ message: '每一項都必填!' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不相符!' })
    }
    if (errors.length) {
      return res.render('reset-password', { errors, password, confirmPassword, id, token }) 
    }
 
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await user.updateOne({ password: hash })
    req.flash('success_msg', '密碼修改成功!')
    res.redirect('/users/login')
  } catch (e) {
    next(e)
  }
})

module.exports = router
