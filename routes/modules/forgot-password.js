const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const JWT_SECRET = process.env.JWT_SECRET
const sendResetPasswordEmail = require('../../helpers/email-helpers')

// get a forgot-password page
router.get('/', (_, res) => {
  res.render('forgot-password')
})

// send reset email
router.post('/', async (req, res, next) => {
  try {
    const { email } = req.body
    //  欄位必填
    if (!email) {
      req.flash('error', '必填選項!')
      return res.redirect('/forgot-password')
    }
    //  驗證帳戶是否存在
    const user = await User.findOne({ email })
    if (!user) {
      req.flash('error', '帳戶不存在!')
      req.flash('email', email)
      return res.redirect('/forgot-password')
    }
    // 建立時效性、防竄改驗證信
    const secret = JWT_SECRET + user.password //  使用JWT Secret 加上 password 當作secret
    const payload = {
      email,
      id: user._id
    }
    const token = jwt.sign(payload, secret, { expiresIn: '5m' })  //  生成jwt token 時效5分鐘
    const link = `http://${req.headers.host}/forgot-password/reset-password/${user._id}/${token}` //  驗證信連結
  
    await sendResetPasswordEmail(user.name, email, link)  //  寄送驗證信

    req.flash('success_msg', '發送成功!')
    req.flash('disabled_btn', 'disabled_btn')
    res.redirect('/forgot-password')
  } catch (err) {
    next(err)
  }
})

//  get a reset-password page
router.get('/reset-password/:id/:token', async (req, res, next) => {
  try {
    const { id, token } = req.params
    const user = await User.findById(id)
    if (!user) throw new Error('用戶不存在')  //  authenticate user

    const secret = JWT_SECRET + user.password

    jwt.verify(token, secret) // 驗證jwt token
    res.render('reset-password', { id, token })
  } catch (err) {
    next(err)
  }
})

// reset password
router.patch('/reset-password/:id/:token', async (req, res, next) => {
  try {
    const { id, token } = req.params
    const { password, confirmPassword } = req.body
    
    const user = await User.findById(id)
    if (!user) throw new Error('用戶不存在')  //  authenticate user

    //  authenticate the token
    const secret = JWT_SECRET + user.password
    jwt.verify(token, secret) //  驗證jwt token
    
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
  } catch (err) {
    next(err)
  }
})

module.exports = router
