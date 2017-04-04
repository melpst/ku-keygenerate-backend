const {Router} = require('express')
const {User} = require('../models')
const util = require('util')
const exec = require('child_process').exec

const RSA = require('node-rsa')
const ursa = require('./ursa')
const nodeRSA = require('./node-rsa')
const browserify = require('./browserify')

const router = Router()

router.use('/nodeRSA', nodeRSA)
router.use('/ursa', ursa)
router.use('/browserify', browserify)

router.get('/', (req,res) => res.send('hello, world'))

router.get('/encrypt', (req, res) => {
	User.findOne({_id: req.session._id})
	.then((data) => {
		exec('ls -al | grep '+data.username+'.pub', (error, stdout, stderr) => {
				console.log(stdout)
			})

		// const publicKey = new RSA(data.key.publicKey)
		// const privateKey = new RSA(data.key.privateKey)

		// const text = 'Hello RSA!';
		// const encrypted = publicKey.encrypt(text, 'base64');
		// console.log('encrypted: ', encrypted);
		// var decrypted = privateKey.decrypt(encrypted, 'utf8');
		// console.log('decrypted: ', decrypted);

		res.send(data)
	})
})

router.get('/keygen', (req, res) =>	{
	const user = User.findOne({_id: req.session._id})
	.then((data) => {
		console.log(data)
		if(data.key.publicKey === undefined){
			console.log('generating key pair')
			exec('./genkey.sh '+data.username+' file:passphrase.txt', (error, stdout, stderr) => {
				console.log('created private key')
			})
			exec('ls -al | grep '+data.username+'.pem', (error, stdout, stderr) => {
				console.log(stdout)
			})
			exec('ls -al | grep '+data.username+'.pub', (error, stdout, stderr) => {
				console.log(stdout)
			})
			
			
			// User.update({_id: req.session._id}, {key: {publicKey, privateKey}})
			// .then((data) => {
			// 	console.log(data)
			// })
		}
		else{
			console.log('this user already has key pair')
		}
	})
	
	res.send('this is keygen page')
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
			console.log('redirecting to /keygen')
			res.status(200).redirect('/keygen')
		}
		else{
			res.status(422).send('wrong password')
		}
	})
})

router.post('/register', (req,res) => {
	const newUser = new User()
	newUser.username = req.body.username
	newUser.password = req.body.password

	newUser.save()
	.then((data) => {
		res.status(201).send(data)
	})
})

router.delete('/:username', (req, res) => {
  User.remove({username: req.params.username})
  .then(() => res.send({success: true}))
})

module.exports = router
