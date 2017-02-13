const {Router} = require('express')
const {User} = require('../models')

const router = Router()

router.get('/', (req,res) => res.send('hello, world'))

router.get('/login', (req,res) => res.send('this is login page'))

router.post('/login', (req,res) => {
	res.send({
		'username' : req.body.username
	})
})

router.post('/register', (req,res) => {
	const newUser = new User()
	newUser.username = req.body.username
	newUser.password = req.body.password

	newUser.save().
	then((data) => {
		res.status(201).send({
			'username' : req.body.username
		})
	})
})

module.exports = router
