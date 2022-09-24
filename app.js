if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const errorHandler = require('./middleware/errorHandler').errorHandler
const routes = require('./routes')
require('./config/mongoose')
const app = express()
const port = 3000

// template engine: express-handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//  middleware: staic files, body-parser, method-override 
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//  middleware: routes
app.use(routes)

//  middleware: 500 errorHandler
app.use(errorHandler)

//  start the server
app.listen(port, () => console.log(`This server is running http://localhost:${port}`))
