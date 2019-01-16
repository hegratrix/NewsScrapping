const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const path = require('path')

const app = express()
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"
mongoose.connect(MONGODB_URI)

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

require('./routes')(app)

app.listen(process.env.PORT || 5000)