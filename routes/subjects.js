const {Router} = require('express')
const axios = require('axios')
const _ = require('lodash')
const {User} = require('../models')

const router = Router()

const keygenIP = 'http://158.108.33.51:3000'
const assessIP = 'http://158.108.33.33:4000'

router.get('/', (req,res) => res.send('subjects~~'))

router.get('/:subjectId', async (req, res) => {
	let canAssess = false
	if(req.session._id === undefined){
		req.session._id = req.headers._id
	}
	if(req.session.state === undefined){
		req.session.state = req.headers.state
	}

	console.log('req.session._id:', req.session._id)
	console.log('req.headers._id:', req.headers._id)
	// if (req.headers._id && !req.session._id) {
	// 	req.session._id = req.headers._id
	// }
	// console.log('req.session._id:', req.session._id)
	// console.log('req.headers._id:', req.headers._id)
	// const data = await User.findOne({_id: req.session._id})
	// console.log('state', data.state)
	console.log('send state to :4000/auth to check')
	const subjectsResponse = await axios.get(assessIP+'/auth', {
		headers: {state: req.session.state}
	})
	console.log('==========================================')
	
	if(!_.isEqual(subjectsResponse.data, {success: true})){
		console.log('state == false, /decrypt to know word')
		const decryptResponse = await axios.post(keygenIP+'/decrypt', {
			_id: req.session._id,
			ciphers: subjectsResponse.data
		})

		console.log('/checkword that word is correct')
		const checkWordResponse = await axios.post(assessIP+'/checkword', {
			word: decryptResponse.data
		})
		console.log('word is', decryptResponse.data)
		console.log('==========================================')

		if(!_.isEqual(checkWordResponse.data, {success: false})){
			console.log('state == true if all users get same word')
			const checkServerResponse = await axios.post(keygenIP+'/checkcipher', {
				_id: req.session._id,
				state: req.session.state,
				word: decryptResponse.data,
				ciphers: subjectsResponse.data,
				keys: checkWordResponse.data
			})
			if(_.isEqual(checkServerResponse.data, {state: true})){
				console.log('All users get same word')
				// const updateData = await User.findOne({_id: req.session._id})
					canAssess = true
					req.session.state = true

				console.log('User state is ', req.session.state)
				const updateSubjectsResponse = await axios.get(assessIP+'/auth', {
					headers: {state: req.session.state}
				})
				console.log('==========================================')
			}
		}
	}
	else{
		canAssess = true
	}

	if(canAssess){
		console.log('Can access assessment form')
		res.send({redirect: true})
	}
	else{
		res.send('authentication failed. please contact administrator')
	}
})

module.exports = router
