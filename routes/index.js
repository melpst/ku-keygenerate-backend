const {Router} = require('express')
const axios = require('axios')
const constants = require("constants")
const crypto = require("crypto")
const fs = require('fs')
const ursa = require('ursa')

const {User} = require('../models')
const subjects = require('./subjects')

const router = Router()

const sendPublicKeyToAssess = (publicKey) => {
	return axios.post('http://localhost:4000/key/publickey', {
		publicKey: publicKey
	})
	.then((response) => {
		if(response.status == 200){
			return response.data
			console.log('send public key successfully')
		}
		else{
			return null
			console.log('cannot send public key')
		}
	})
}

router.use('/subjects', subjects)

router.get('/', (req,res) => res.send('hello, world'))

router.get('/decrypt', (req, res) =>{
	User.findOne({_id: req.session._id})
	.then((data) => {
		const privateKey = fs.readFileSync('./'+data.key.privateKey, 'utf8')
		const buf = fs.readFileSync('./'+data.username+'.enc', 'hex')
		const cipher = Buffer.from(buf, 'hex')
		const msg = crypto.privateDecrypt({"key": privateKey, padding: constants.RSA_NO_PADDING}, cipher)
		res.send(msg)
	})
})

router.get('/encrypt', (req, res) => {
	const padding = new Buffer('fdgmydvm;8') //crypto.randomBytes(10)
	const plain = fs.readFileSync('./file.txt', 'utf8')
	let plainBuf = Buffer.from(plain)
	plainBuf = Buffer.concat([plainBuf, padding], 256)

	User.findOne({_id: req.session._id})
	.then((data) => {
		const publicKey = fs.readFileSync('./'+data.key.publicKey, 'utf8')
		const cipher = crypto.publicEncrypt({"key": publicKey, padding: constants.RSA_NO_PADDING}, plainBuf)

		fs.writeFileSync("./"+data.username+'.enc', cipher, 'hex')
		res.send(cipher.toString('hex'))
	})
})

router.get('/login', (req,res) => res.send('this is login page'))

router.get('/users', (req,res) => {
	User.find()
	.then((data) => {
		res.send(data)
	})
})

router.post('/login', (req,res) => {
	const query = User.findOne({username : req.body.username})
	.then((data) => {
		if(data.password === req.body.password){
			console.log('saving _id to session')
			req.session._id = data._id
			res.status(200).redirect('/subjects')
		}
		else{
			res.status(422).send('wrong password')
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
			const cipherId = await sendPublicKeyToAssess(publicKey)

			const newUser = new User()
			newUser.username = req.body.username
			newUser.password = req.body.password
			newUser.key.publicKey = publicKey
			newUser.key.privateKey = privateKey
			newUser.cipherId = cipherId

			newUser.save()
			.then((data) => res.status(201).send(data))
			.catch((error) => console.log(error))
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
  .catch((error) => console.log(error))
})

module.exports = router
