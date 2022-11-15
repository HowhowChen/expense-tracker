const router = require('express').Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const { registorValidator } = require('../../middleware/validatorHandler')

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
router.post('/register', registorValidator, async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const user = await User.findOne({ email })

    if (user) {
      return res.status(422).render('register', {
        error: '這個email已註冊過',
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
