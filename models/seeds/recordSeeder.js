const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const userJson = require('./user.json')
const recordJson = require('./record.json')
const User = require('../user')
const Record = require('../record')
const Category = require('../category')

const db = require('../../config/mongoose')


db.once('open', async () => {
  await Promise.all(userJson.map(async user => {
    const { name, email, password } = user
    await bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(async user => {
        await Promise.all(recordJson.map(async record => {
          await Category.findOne({ name: record.category_name })
            .then(async category => {
              await Record.create({
                name: record.name,
                date: record.date,
                amount: record.amount,
                category_id: category._id,
                user_id: user._id
              })
            })
            .catch(err => console.log(err))
        }))
      })
  }))
  .then(() => {
    console.log('finish user and record seeds and db close')
    db.close()
  })
  .catch(err => console.log(err))
  .finally(() => {
    console.log('shut down process')
    process.exit()
  })
})
