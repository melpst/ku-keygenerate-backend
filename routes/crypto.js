const {Router} = require('express')
const constants = require("constants")
const crypto = require("crypto")
const fs = require('fs')

const router = Router()

router.get('/encrypt', (req, res) => {
	let plain
	fs.readFile("./file.txt", "utf-8", function(err, plain) {
		console.log(plain)
		fs.readFile("./melpst.pub", 'utf8', function (err, data) {
			console.log(data)
			const bufferToEncrypt = new Buffer(plain);
			const encrypted = crypto.publicEncrypt({"key":data, padding:constants.RSA_NO_PADDING}, bufferToEncrypt).toString("base64");
			res.send(encrypted);  // length 128
		})
	})
	
})

module.exports = router