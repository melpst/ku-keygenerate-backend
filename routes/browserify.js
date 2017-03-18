const {Router} = require('express')
const ursa = require('ursa')
const RSA = require('node-rsa')
const constants = require('constants')
const crypt = require('crypto-browserify')

const router = Router()

router.get('/keygen', (req, res) =>	{

			console.log('generating key pair')

			const genKey = ursa.generatePrivateKey()
			const plain = 'hello, worldsdofdsjflksdjfklsjdfkjklsdjfkldjskfjskladswo547wu[9tghvknsacmz;;hln.,mvsczxoi4jhwsdmv,CZ9hoink42ewqa-0po;k3l2qefwadohijlkn;arsv9upfihonadadsssssdasdwasfdfadfsaxzczdfdrrewrwsfdvcxvfbfdgsrewrdsfzvxczfdsds||90joilkgac8hojbkg3a0zjpo;lkm4wddsvgaasas'
			const pub = genKey.toPublicPem('utf8')
			const pri = genKey.toPrivatePem('utf8')

			const key = {
				private: pri,
				public: pub,
				padding: constants.RSA_NO_PADDING
			}

			const pubBuf = new Buffer(pub, 'utf8')
			const plain_buf = new Buffer(plain, 'utf8')
			const cipher = crypt.publicEncrypt({key: pubBuf, padding: constants.RSA_NO_PADDING}, plain_buf).toString('hex')
			console.log('cipher: '+cipher)
			
	
	res.send('this is keygen page')
})


module.exports = router
