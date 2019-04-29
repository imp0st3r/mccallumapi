var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var mysql = require('mysql');
var mysql_config = {
	host     : 'localhost',
	port     :  3306,
	user     : 'root',
	password : '!Imp0st3r1983',
	database : 'mccallum',
};

var validPassword = function(user,password) {
	console.log(password);
	var hash = crypto.pbkdf2Sync(password, user.salt, 100000, 64, 'sha512').toString('hex');
	console.log(hash);
	return user.hash === hash;
};

passport.use(new LocalStrategy({
	usernameField: 'email'
}, function(username, password, done){
	console.log(username);
	console.log(password);
	var con = mysql.createConnection(mysql_config);
	con.connect(function(err) {
		if (err) {
			con.end();
			return done(null,false,{"error":err});
		}else{
			console.log("Connected!");
			var query = "SELECT * FROM users WHERE email='"+username+"';";
			con.query(query, function (err, result) {
				if (err) {
					con.end();
					return done(null,false,{"error":err});
				}else{
					console.log(result);
					if(result.length > 0){
						var cUser = result[0];
						if(validPassword(cUser,password)){
							con.end();
							return done(null,cUser);
						}else{
							con.end();
							return done(null,false,{"message":"Invalid Password."});
						}
					}else{
						con.end();
						return done(null,false,{"message":"Invalid Email."});
					}
				}
			});
		}
	});
}
));