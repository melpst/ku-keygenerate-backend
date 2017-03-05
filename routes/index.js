const {Router} = require('express')
const {User} = require('../models')
const RSA = require('node-rsa')

const router = Router()

router.get('/', (req,res) => res.send('hello, world'))


router.get('/login', (req,res) => res.send('this is login page'))

router.get('/keygen', (req, res) =>	{
	
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
