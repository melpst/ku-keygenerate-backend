const {Router} = require('express')
const ursa = require('ursa')

const router = Router()

router.get('/keygen', (req, res) =>	{
	// const user = User.findOne({_id: req.session._id})
	// .then((data) => {
	// 	console.log(data)
	// 	if(!data.key.privateKey && data.key.privateKey==null){
			console.log('generating key pair')

			const key = ursa.generatePrivateKey()
			const plain = 'hello, worldsdofdsjflksdjfklsjdfkjklsdjfkldjskfjskladswo547wu[9tghvknsacmz;;hln.,mvsczxoi4jhwsdmv,CZ9hoink42ewqa-0po;k3l2qefwadohijlkn;arsv9upfihonadadsssssdasdwasfdfadfsaxzczdfdrrewrwsfdvcxvfbfdgsrewrdsfzvxczfdsds||90joilkgac8hojbkg3a0zjpo;lkm4wddsvgaasas'
			const pub = key.toPublicPem('utf8')
			const pri = key.toPrivatePem('utf8')
			const liv = ursa.createPublicKey(pub)
			const vate = ursa.createPrivateKey(pri)
			const plain_buf = new Buffer(plain, 'utf8').toString('hex')
			const cipher = key.privateEncrypt(plain, 'utf8', 'hex', ursa.RSA_NO_PADDING)
			console.log('cipher: '+cipher)
			
			
	// 	}
	// 	else{
	// 		console.log('this user already has key pair')
	// 	}
	// })
	
	res.send('this is keygen page')
})


module.exports = router
