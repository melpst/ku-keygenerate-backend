const {Router} = require('express')
const RSA = require('node-rsa')
const constants = require('constants')

const router = Router()

router.get('/keygen', (req, res) =>	{
	// const user = User.findOne({_id: req.session._id})
	// .then((data) => {
	// 	console.log(data)
	// 	if(!data.key.privateKey && data.key.privateKey==null){
			
			const key = new RSA ({b: 2048}, {encryptionScheme: {
														            scheme:'pkcs1',
																    encryptionScheme:{
																    	padding: constants.RSA_NO_PADDING
																    }
														       }
										    })
			// const publicKey = key.exportKey('pkcs1-public')
			// const privateKey = key.exportKey('pkcs1-private')
			// const pub = new RSA(publicKey)
			// const pri = new RSA(privateKey)

			const text = 'Hello RSA!';
			const encrypted = key.encrypt(text, 'base64');
			console.log('encrypted: ', encrypted);
			var decrypted = key.decrypt(encrypted, 'utf8');
			console.log('decrypted: ', decrypted);
			
			// User.update({_id: req.session._id}, {key: {publicKey, privateKey}})
			// .then((data) => {
			// 	console.log(data)
			// })
			
	// 	}
	// 	else{
	// 		console.log('this user already has key pair')
	// 	}
	// })
	
	res.send('this is keygen page')
})



module.exports = router