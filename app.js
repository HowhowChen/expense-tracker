const express = require('express')
const exphbs = require('express-handlebars')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes')

require('./config/mongoose')

const app = express()
const port = 3000

// setting handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//  setting static file
app.use(express.static('public'))

//  將requres 導入路由器
app.use(routes)

app.listen(port, () => console.log(`This server is running http://localhost:${port}`))
