const {Router} = require('express')
const axios = require('axios')
const constants = require("constants")
const crypto = require("crypto")
const fs = require('fs')
const ursa = require('ursa')

const {User} = require('../models')
const subjects = require('./subjects')

const router = Router()

const keygenIP = 'http://158.108.33.51:3000'
const assessIP = 'http://158.108.33.33:4000'

const sendPublicKeyToAssess = (publicKey) => {
	return axios.post(assessIP+'/key/publickey', {
		publicKey: publicKey
	})
	.then((response) => {
		if(response.status == 200){
			return response.data
			console.log('Sending public key successfully')
		}
		else{
			return null
			console.log('Cannot send public key')
		}
	})
}

router.use('/subjects', subjects)

router.get('/', (req,res) => res.send('hello, world'))

router.post('/decrypt', (req, res) =>{
	User.findOne({_id: req.body._id})
	.then((data) => {
		const privateKey = Buffer.from(data.key.privateKey)
		const cipherHex = req.body.ciphers.filter(c => c._id === data.cipherId)[0].cipher

		const cipherBuf = Buffer.from(cipherHex, 'hex')
		console.log('Decrypting...')
		const msg = crypto.privateDecrypt({"key": privateKey, padding: constants.RSA_NO_PADDING}, cipherBuf)
		const plain = msg.slice(0,msg.length-10)
		console.log('Plain text is ', plain.toString())
		console.log('==========================================')
		res.send(plain)
	})
	.catch((error) => res.send({success: false}))
})

router.post('/checkcipher', (req, res) => {
	const originalCiphers = req.body.ciphers
	const publicKeys = req.body.keys
	const plain = Buffer.from(req.body.word)

	console.log('Checking each cipher to fresh encrypt cipher')
	for (let key in publicKeys) {
		const padding = Buffer.from(publicKeys[key].padding)
		const plainBuf = Buffer.concat([plain, padding], 256)
		const cipher = crypto.publicEncrypt({"key": publicKeys[key].publicKey, padding: constants.RSA_NO_PADDING}, plainBuf).toString('utf8')

		const cipherHex = originalCiphers.filter(c => c._id === publicKeys[key]._id)[0].cipher
		const cipherBuf = Buffer.from(cipherHex, 'hex')
		const originalCipher = cipherBuf.toString('utf8')

		if(cipher !== originalCipher){
			console.log('Cipher is not correct.')
			console.log('==========================================')
			res.send({success: false})
		}
	}


	// User.update({_id: req.body._id}, {state: true})
	// .then((data) => {
	console.log('Ciphers are correct.')
	console.log('==========================================')
	res.send({state: true})
	// })
	// .catch((error) => {
	// 	res.send({success: false})
	// })
})

router.get('/login', (req,res) => res.send('this is login page'))

router.get('/users', (req,res) => {
	User.find()
	.then((data) => {
		res.send(data)
	})
})

router.post('/login', (req,res) => {
	User.findOne({username : req.body.username})
	.then((data) => {
		if(data){
			if(data.password === req.body.password){
				console.log('saving _id to session')
				req.session._id = data._id
				req.session.state = false
				res.status(200).send({ _id: data._id })
			}
			else{
				res.status(403).send('wrong password')
			}
		}
		else{
			res.status(403).send('wrong username')
		}
	})
})

router.post('/register', (req,res) => {
	User.findOne({username: req.body.username})
	.then(async (data) => {
		if(!data){
			const genKey = ursa.generatePrivateKey()
			const publicKey = genKey.toPublicPem('utf8')
			const privateKey = genKey.toPrivatePem('utf8')
			fs.writeFileSync('./pri.pem', privateKey, 'utf8')
			fs.writeFileSync('./pub.pem', publicKey, 'utf8')
			const cipherId = await sendPublicKeyToAssess(publicKey)

			const newUser = new User()
			newUser.username = req.body.username
			newUser.password = req.body.password
			newUser.key.publicKey = publicKey
			newUser.key.privateKey = privateKey
			newUser.cipherId = cipherId

			newUser.save()
			.then((data) => res.status(201).send(data))
			.catch((error) => res.send(error))
		}
		else {
			res.status(409).send('this username has been used')
		}
	})
})

router.delete('/:username', (req, res) => {
  User.remove({username: req.params.username})
  .then((data) => {
		res.send('delete user successfully')
	})
  .catch((error) => res.send(error))
})


module.exports = router
