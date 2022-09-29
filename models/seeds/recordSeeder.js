const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const users = require('./user.json')
const records = require('./record.json')
const User = require('../user')
const Record = require('../record')
const Category = require('../category')

const db = require('../../config/mongoose')

db.once('open', async () => {
  try {
    await Promise.all(
      users.map(async (user) => {
        const { name, email, password } = user
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const createUser = await User.create({
          name,
          email,
          password: hash
        })
        await Promise.all(
          records.map(async (record) => {
            const category = await Category.findOne({ name: record.category_name }).lean()
            await Record.create({
              name: record.name,
              date: record.date,
              amount: record.amount,
              category_id: category._id,
              user_id: createUser._id
            })
          })
        )
      })
    )
    console.log('finish user and record seeds and db close')
    console.log('shut down process')
    db.close()
    process.exit()
  } catch (e) {
    console.log(e)
  }
})
