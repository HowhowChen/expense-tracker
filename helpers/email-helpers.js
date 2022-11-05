if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendResetPasswordEmail (name, clientEmail, link) {
  return new Promise((resolve, reject) => {
    const msg = {
      to: clientEmail,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject: 'Reset Password for Expense Tracker',
      html: `<h1>Hi, ${name}</h1><h2>Here is <a href=${link}>your reset password link.</a></h2>
             <h2>The link is valid for only 5 minutes!</h2>`,
    }
    return sgMail
      .send(msg)
      .then(response => resolve(response))
      .catch(e => reject(e))
  })
}

module.exports = sendResetPasswordEmail
