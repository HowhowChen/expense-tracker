const router = require('express').Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')

//  get a login page
router.get('/login', (_, res) => {
  res.render('login')
})

//  login: authecation
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

//  logout: delete session
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出')
  res.redirect('/users/login')
})

//  get a register page
router.get('/register', (_, res) => {
  res.render('register')
})

//register: add a new user
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if ( !name || !email || !password || !confirmPassword) {
      errors.push({ message: '每一項都必填!' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不相符' })
    }
    if (errors.length) {
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }

    const user = await User.findOne({ email })
    if (user) {
      errors.push({ message: '這個email已註冊過!' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }

    // generate hash
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await User.create({
      name,
      email,
      password: hash
    })
    res.redirect('/')
  } catch (err) {
    next(err)
  }
})

module.exports = router
