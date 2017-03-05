const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
	username: String,
	password: String,
	key: {
		publicKey : String,
		privateKey : String
	}
}, { minimize: false })

module.exports = mongoose.model('User', userSchema)