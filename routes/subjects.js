const {Router} = require('express')

const router = Router()

router.get('/', (req,res) => res.send('subjects~~'))

router.get('/:subjectId', (req, res) => {
	res.redirect('http://localhost:4000/cipher')
})

module.exports = router
