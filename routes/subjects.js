const {Router} = require('express')
const axios = require('axios')
const {User} = require('../models')

const router = Router()

router.get('/', (req,res) => res.send('subjects~~'))

router.get('/:subjectId', (req, res) => {
	User.findOne({_id: req.session._id})
	.then((data) => {
		axios.get('http://localhost:4000/subjects/'+req.params.subjectId, {
			state: data.state
		})
		.then((response) => {
			res.send(response.data)
		})
	})
	
})

module.exports = router
