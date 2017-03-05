const {Router} = require('express')
const {User} = require('../models')
const RSA = require('node-rsa')

const router = Router()

router.get('/', (req,res) => res.send('hello, world'))

router.get('/users', (req,res) => {
	User.find()
	.then((data) => {
		res.send(data)
	})
})

router.get('/login', (req,res) => res.send('this is login page'))

router.get('/keygen', (req, res) =>	{
	const user = User.findOne({_id: req.session._id})
	.then((data) => {
		console.log('generating key pair')
		if(user.key === undefined){
			const key = new RSA ({b: 2048})
			const publicKey = key.exportKey('pkcs8-public')
			const privateKey = key.exportKey('pkcs8-private')

			User.update({_id: req.session._id}, {key: {publicKey, privateKey}})
			.then((data) => {
				console.log(user)
			})
		}
		else{
			console.log('this user already has key pair')
		}
	})
	
	res.send('this is keygen page')
})

router.post('/login', (req,res) => {
	const query = User.findOne({username : req.body.username})
	.then((data) => {
		if(data.password === req.body.password){
			console.log(data)
			req.session._id = data._id
			console.log(req.session)
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
