var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	name: String,
	hash: String,
	salt: String,
});

userSchema.methods.setPassword = function(password) {
	console.log(password);
	this.salt = crypto.randomBytes(16).toString('hex');
	console.log(this.salt);
	this.hash = crypto.pbkdf2Sync(password, this.salt, 100000, 64, 'sha512').toString('hex');
	console.log(this.hash);
};

userSchema.methods.validPassword = function(password) {
	console.log(password);
	var hash = crypto.pbkdf2Sync(password, this.salt, 100000, 64, 'sha512').toString('hex');
	console.log(this.salt);
	console.log(hash);
	console.log(this.hash);
	return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jwt.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		exp: parseInt(expiry.getTime() / 1000),
	}, process.env.JWT_SECRET );
};


mongoose.model('User', userSchema, 'users');
