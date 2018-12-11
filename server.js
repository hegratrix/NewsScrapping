const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const axios = require('axios')
const cheerio = require('cheerio')
const path = require('path')

const db = require('./models')
const app = express()
mongoose.connect('mongodb://localhost/articles', {
    useNewUrlParser: true })

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

require('./routes')(app)

app.listen(3000, _ => console.log('http://localhost3000'))