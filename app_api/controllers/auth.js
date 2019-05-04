var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONreponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.login = function(req, res) {
	console.log(req.body);
	if(!req.body.password) {
		sendJSONreponse(res, 400, { "message": "All fields required"});
		return;
	}

	passport.authenticate('local', function(err, user, info) {
		var token;

		if (err) {
			sendJSONreponse(res, 404, err);
			return;
		}

		if (user) {
			console.log(user);
			user.status = "logged-in";
			user.save(function(err,user){
				if(err){
					sendJSONreponse(res,400,err);
				}else{
					token = user.generateJwt();
					sendJSONreponse(res, 200, { "token": token});
				}
			})
		} else {
			sendJSONreponse(res, 401, info);
		}
	}) (req, res);
};