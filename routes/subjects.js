const {Router} = require('express')
const axios = require('axios')
const {User} = require('../models')

const router = Router()

router.get('/', (req,res) => res.send('subjects~~'))

router.get('/:subjectId', async (req, res) => {
	const data = await User.findOne({_id: req.session._id})
	const subjectsResponse = await axios.get('http://localhost:4000/subjects/'+req.params.subjectId, {
		state: data.state
	})
	console.log('cipher', subjectsResponse.data)
	const decryptResponse = await axios.post('http://localhost:3000/decrypt', {
		_id: req.session._id,
		ciphers: subjectsResponse.data
	})
	const checkWordResponse = await axios.post('http://localhost:4000/checkword', {
		word: decryptResponse.data
	})
	res.send(checkWordResponse.data)
	
})

module.exports = router
