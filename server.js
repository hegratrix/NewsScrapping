const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const path = require('path')

const db = require('./models')
const app = express()
const MONGODB_URI = 'mongodb://hegratrix:uciRocks18@ds259154.mlab.com:59154/heroku_fdmr8vk9'|| "mongodb://localhost/articles"
mongoose.connect(MONGODB_URI)
.catch(e => 
    console.log(e))

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

require('./routes')(app)

app.listen(process.env.PORT || 3000)