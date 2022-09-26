const router = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const JWT_SECRET = process.env.JWT_SECRET
const sendResetPasswordEmail = require('../../helpers/email-helpers')

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/google', passport.authenticate('google', {
  scope: ['email', 'profile']
}))

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// get a forgot-password page
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password')
})

module.exports = router
