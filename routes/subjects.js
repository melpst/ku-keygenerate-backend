const {Router} = require('express')
const axios = require('axios')
const _ = require('lodash')
const {User} = require('../models')

const router = Router()

router.get('/', (req,res) => res.send('subjects~~'))

router.get('/:subjectId', async (req, res) => {
	console.log('req.session._id:', req.session._id)
	console.log('req.headers._id:', req.headers._id)
	if (req.headers._id && !req.session._id) {
		req.session._id = req.headers._id
	}
	console.log('req.session._id:', req.session._id)
	console.log('req.headers._id:', req.headers._id)
	const data = await User.findOne({_id: req.session._id})
	console.log('state', data.state)
	const subjectsResponse = await axios.get('http://localhost:4000/auth', {
		headers: {state: data.state}
	})

	if(!_.isEqual(subjectsResponse.data, {success: true})){
		console.log('/decrypt get word')
		const decryptResponse = await axios.post('http://localhost:3000/decrypt', {
			_id: req.session._id,
			ciphers: subjectsResponse.data
		})

		console.log('/checkword that word is correct')
		const checkWordResponse = await axios.post('http://localhost:4000/checkword', {
			word: decryptResponse.data
		})

		console.log('word is', decryptResponse.data)

		if(_.isEqual(checkWordResponse.data, {success: false})){
			res.send(checkWordResponse.data)
		}
		else{
			const checkServerResponse = await axios.post('http://localhost:3000/checkcipher', {
				_id: req.session._id,
				word: decryptResponse.data,
				ciphers: subjectsResponse.data,
				keys: checkWordResponse.data
			})
			if(!_.isEqual(checkServerResponse.data, {success: true})){
				res.send(checkServerResponse.data)
			}
			else{
				const updateData = await User.findOne({_id: req.session._id})
				console.log('update data state', updateData.state)
				const updateSubjectsResponse = await axios.get('http://localhost:4000/auth', {
					headers: {state: updateData.state}
				})
				res.send(updateSubjectsResponse.data)
			}
		}
	}
	else{
		res.send(subjectsResponse.data)
	}
})

module.exports = router
