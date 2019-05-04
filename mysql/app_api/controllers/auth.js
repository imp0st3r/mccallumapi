
var passport = require('passport');    
var mysql = require('mysql');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var mysql_config = {
	host     : 'localhost',
	port     :  3306,
	user     : 'imp0st3r',
	password : '!Imp0st3r1983',
	database : 'mccallum',
};
var user = {}

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

var setPassword = function(password) {
	console.log(password);
	user.salt = crypto.randomBytes(16).toString('hex');
	user.hash = crypto.pbkdf2Sync(password, user.salt, 100000, 64, 'sha512').toString('hex');
};


var generateJwt = function(currentUser) {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jwt.sign({
		id: currentUser.id,
		email: currentUser.email,
		name: currentUser.name,
		role: currentUser.role,
		exp: parseInt(expiry.getTime() / 1000),
	}, process.env.JWT_SECRET );
};

module.exports.register = function(req, res) {
    console.log(req.body);
	if(!req.body.name || !req.body.email || !req.body.password || !req.body.role) {
		sendJSONresponse(res, 400, {"message": "All fields required"});
		return;
	}else{
		user = {
			name : req.body.name,
			email : req.body.email,
			hash : "",
			salt : "",
			role : req.body.role
		}
		setPassword(req.body.password);
		console.log(user);
		var con = mysql.createConnection(mysql_config);
		con.connect(function(err) {
			if (err) {
				sendJSONresponse(res,400,{"error":err});
				con.end();
			}else{
				console.log("Connected!");
				var query = "INSERT INTO users (name,email,hash,salt,role) VALUES ('"+user.name+"','"+user.email+"','"+user.hash+"','"+user.salt+"','"+user.role+"');";
				con.query(query, function (err, result) {
					if (err) {
						sendJSONresponse(res,400,{"error":err});
						con.end();
					}else{
						query = "SELECT * FROM users WHERE email='"+user.email+"';"
						con.query(query, function(err,result){
							if(err){
								sendJSONresponse(res,400,{"error":err});
							}else{
								if(result.length > 0){
									var cUser = result[0];
									var token = generateJwt(cUser);
									con.end();
									sendJSONresponse(res,200, { "token": token});
								}else{
									con.end();
									return done(null,false,{"message":"Email was not found."});
								}
							}
						})
					}
				});
			}
		});
	}
};
module.exports.login = function(req, res) {
    console.log(req.body);
	if(!req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, { "message": "All fields required"});
		return;
	}

	passport.authenticate('local', function(err, user, info) {
		if (err) {
			sendJSONresponse(res, 404, err);
			return;
		}
		if (user) {
			console.log(user);
			var token = generateJwt(user);
			var con = mysql.createConnection(mysql_config);
			con.connect(function(err) {
				if (err) {
					sendJSONresponse(res,400,{"error":err});
					con.end();
				}else{
					console.log("Connected!");
					var query = "UPDATE users SET status='logged-in' WHERE email='"+user.email+"';";
					con.query(query, function (err, result) {
						if(err){
							con.end();
							sendJSONresponse(res,400,{"error":err});
						}else{
							sendJSONresponse(res, 200, { "token": token});
						}
					});
				}
			});
		} else {
			sendJSONresponse(res, 401, info);
		}
	}) (req, res);
};