const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const routes = require('./routes')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/', routes)

app.listen(port, () => console.log('listen in port '+port))