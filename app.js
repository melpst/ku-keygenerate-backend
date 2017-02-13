const express = require('express')
const port = process.env.PORT || 3000
const routes = require('./routes')

const app = express()

app.use('/', routes)

app.listen(port, () => console.log('listen in port '+port))