const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const path = require('path')

mongoose.set('useCreateIndex', true)
const app = express()
// var MONGODB_URI = "mongodb://hegratrix:uciRocks18@ds259154.mlab.com:59154"
mongoose.connect(
    "mongodb://localhost/test",
    { useNewUrlParser: true }
)

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

require('./routes')(app)

app.listen(process.env.PORT || 5000)