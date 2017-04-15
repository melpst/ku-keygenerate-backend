const {Router} = require('express')
const randomBytes = require('random-bytes')
const {User} = require('../models')
const util = require('util')
const exec = require('child_process').exec

const router = Router()

router.get('/', (req,res) => res.send('hello, world'))

router.get('/encrypt', (req, res) => {
	User.findOne({_id: req.session._id})
	.then((data) => {
		const p1 = new Promise((resolve, reject) => {
			exec('openssl rsautl -encrypt -in file.txt -pubin -inkey '+data.key.publicKey+' -raw -out '+data.username+'.enc', (error, stdout, stderr) => {
				console.log('encrypted successfully')
				resolve('resolve')
			})
		})

		const p2 = new Promise((resolve, reject) => {
			exec('cat '+data.username+'.enc',(error, stdout, stderr) => {
				resolve(stdout)
			})
		})

		Promise.all([p1,p2])
		.then((value) => {
			res.send({cipher: value[1]})
		})
		.catch((error) => console.log(error))


	})
})

router

router.get('/keygen', (req, res) =>	{
	const user = User.findOne({_id: req.session._id})
	.then((data) => {
		console.log(data)
		if(data.key.publicKey === undefined){
			let publicKey = ''
			let privateKey = ''
			console.log('generating key pair')
			exec('./genkey.sh '+data.username, (error,stdout, stderr) => {
				console.log('created key pair')
			})

			const p1 = new Promise ((resolve, reject) => {
				exec('ls -al | grep '+data.username+'.pub', (error, stdout, stderr) => {
					if(stdout){
						publicKey = data.username+'.pub'
						resolve(publicKey)
					}
				})
			})

			const p2 = new Promise ((resolve, reject) => {
				exec('ls -al | grep '+data.username+'.pem', (error, stdout, stderr) => {
					if(stdout){
						privateKey = data.username+'.pem'
						resolve(privateKey)
					}
				})
			})

			Promise.all([p1,p2])
			.then((value) => {
				User.update({_id: req.session._id}, {key: {publicKey: value[0], privateKey:value[1]}})
				.then((data) => {
					console.log(privateKey)
					console.log(publicKey)
					if(data.ok == 1){
						console.log('update success')
					}
					else{
						console.log('error generateing keys')
					}
				})
			})
			.catch((error) => console.log(error))
			
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
	User.findOne({username: req.body.username})
	.then((data) => {
		if(!data){
			const newUser = new User()
			newUser.username = req.body.username
			newUser.password = req.body.password

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
  .then(() => res.send({success: true}))
  .catch((error) => console.log(error))
})

module.exports = router
