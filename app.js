const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const session = require('express-session')
const cors = require('cors')
const routes = require('./routes')
const configDB = require('./credentials/mongolab.js')
const port = process.env.PORT || 3000

const app = express()

mongoose.Promise = require('bluebird')
mongoose.connect(configDB.url)

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
	secret: 'qwertyuiop',
	saveUninitialized: true,
	resave: false
}))
app.use(cors())

app.use('/', routes)

app.listen(port, () => console.log('listen in port '+port))