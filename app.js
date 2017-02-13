const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const routes = require('./routes')
const configDB = require('./credentials/mongolab.js')
const port = process.env.PORT || 3000

const app = express()

mongoose.connect(configDB.url)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/', routes)

app.listen(port, () => console.log('listen in port '+port))