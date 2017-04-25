const {Router} = require('express')
const axios = require('axios')
const _ = require('lodash')
const {User} = require('../models')

const router = Router()

router.get('/', (req,res) => res.send('subjects~~'))

router.get('/:subjectId', async (req, res) => {
	let canAssess = false
	// console.log('req.session._id:', req.session._id)
	// console.log('req.headers._id:', req.headers._id)
	// if (req.headers._id && !req.session._id) {
	// 	req.session._id = req.headers._id
	// }
	// console.log('req.session._id:', req.session._id)
	// console.log('req.headers._id:', req.headers._id)
	// const data = await User.findOne({_id: req.session._id})
	// console.log('state', data.state)
	console.log('sned state to :4000/auth to check')
	const subjectsResponse = await axios.get('http://localhost:4000/auth', {
		headers: {state: req.session.state}
	})

	if(!_.isEqual(subjectsResponse.data, {success: true})){
		console.log('state == false, /decrypt to know word')
		const decryptResponse = await axios.post('http://localhost:3000/decrypt', {
			_id: req.session._id,
			ciphers: subjectsResponse.data
		})

		console.log('/checkword that word is correct')
		const checkWordResponse = await axios.post('http://localhost:4000/checkword', {
			word: decryptResponse.data
		})

		console.log('word is', decryptResponse.data)

		if(!_.isEqual(checkWordResponse.data, {success: false})){
			console.log('state == true if all users get same word')
			const checkServerResponse = await axios.post('http://localhost:3000/checkcipher', {
				_id: req.session._id,
				word: decryptResponse.data,
				ciphers: subjectsResponse.data,
				keys: checkWordResponse.data
			})
			if(_.isEqual(checkServerResponse.data, {success: true})){
				// const updateData = await User.findOne({_id: req.session._id})
				console.log('updated data state', req.session.state)
				const updateSubjectsResponse = await axios.get('http://localhost:4000/auth', {
					headers: {state: req.session.state}
				})
				if(_.isEqual(checkServerResponse.data, {success: true})){
					console.log('check after change state')
					canAssess = true
				}
			}
		}
	}
	else{
		canAssess = true
	}

	if(canAssess){
		res.send({redirect: true})
	}
	else{
		res.send('authentication failed. please contact administrator')
	}
})

module.exports = router
