const express = require('express')
const port = process.env.PORT || 3000
const app = express()

app.get('/', (req,res) => res.send({success: true}))

app.listen(port, () => console.log('listen in port '+port))