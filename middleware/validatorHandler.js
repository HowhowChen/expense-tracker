const { body, validationResult } = require('express-validator')
const { amountValidator } = require('../helpers/validation-helpers')
//  註冊驗證內容
const registerValidations = [
  body('name').trim().not().isEmpty().withMessage('名字不可空白'),
  body('email').isEmail().normalizeEmail().withMessage('請輸入正確Email'),
  body('password').trim().not().isEmpty().withMessage('密碼不可空白').bail().isLength({ min: 5 }).withMessage('密碼大於5位'),
  body('confirmPassword').trim().not().isEmpty().withMessage('確認密碼不可空白').bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('密碼與確認密碼不相符')
      }
      return true //  沒問題務必回傳true!!
    })
]
//  record 新增、修改驗證內容
const recordValidations = [
  body('name').trim().not().isEmpty().withMessage('名稱不可空白'),
  body('date').trim().not().isEmpty().withMessage('日期不可空白'),
  body('category').trim().not().isEmpty().withMessage('種類不可空白'),
  body('amount').trim().not().isEmpty().withMessage('金額不可空白').bail()
    .custom(value => {
      if (!amountValidator(value)) throw new Error('金額不接受小數點和負數')
      return true //  沒問題務必回傳true!!
    })
]

module.exports = {
  registorValidator: async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
    //  平行執行註冊驗證
    await Promise.all(registerValidations.map(registerValidation => (
      registerValidation.run(req)
    )))
    //  驗證結果
    const errors = validationResult(req)
    //  結果有錯
    if (!errors.isEmpty()) {
      return res.status(422).render('register', {
        errors: errors.array(),
        name,
        email,
        password,
        confirmPassword
      })
    }

    next()
  },
  recordValidator: async (req, res, next) => {
    const { name, date, category, amount } = req.body
    const _id = req.params.id
    //  平行執行record驗證
    await Promise.all(recordValidations.map(recordValidation => (
      recordValidation.run(req)
    )))
    //  驗證結果
    const errors = validationResult(req)
    //  結果有誤
    if (!errors.isEmpty()) {
      if (_id) {
        req.flash('errors', errors.array())
        return res.redirect(`/records/${_id}/edit`)
      } else {
        return res.status(422).render('new', {
          errors: errors.array(),
          name,
          date,
          category,
          amount
        })
      }
    }

    next()
  }
}
