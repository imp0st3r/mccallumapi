var mysql = require('mysql');
var crypto = require('crypto');
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

module.exports.getUsers = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM users";
            con.query(query, function (err, results) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    sendJSONresponse(res,200,results);
                }
            });
        }
    });
}
module.exports.getUserById = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM users WHERE id="+req.params.id;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    sendJSONresponse(res,200,result[0]);
                }
            });
        }
    });
}
module.exports.getUserByEmail = function(req,res){
    console.log(req.params.email);
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err){
        if(err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected! Getting user by email: " + req.params.email);
            var query = "SELECT * FROM users WHERE email='"+req.params.email+"'";
            con.query(query, function(err,result){
                if(err){
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    console.log(result);
                    sendJSONresponse(res,200,result[0]);
                }
            })
        }
    })
}
module.exports.createUser = function(req, res) {
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
									con.end();
									sendJSONresponse(res,200,result[0]);
								}else{
									con.end();
                                    sendJSONresponse(res,200,{"message":"Email was not found."});
								}
							}
						})
					}
				});
			}
		});
	}
};
module.exports.resetPassword = function(req,res){
    user = {
        name : req.body.name,
        email : req.body.email,
        hash : "",
        salt : "",
        role : req.body.role
    }
    setPassword(req.body.password);
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "UPDATE users SET hash='"+user.hash+"',salt='"+user.salt+"' WHERE id="+req.params.id;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    query = "SELECT * FROM users WHERE email='"+user.email+"';"
                    con.query(query, function(err,result){
                        if(err){
                            sendJSONresponse(res,400,{"error":err});
                        }else{
                            if(result.length > 0){
                                con.end();
                                sendJSONresponse(res,200,result[0]);
                            }else{
                                con.end();
                                sendJSONresponse(res,200,{"message":"Email was not found."});
                            }
                        }
                    })
                }
            });
        }
    });
}
module.exports.updateUser =function(req,res){
    user = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
    }
    console.log(user);
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "UPDATE users SET name='"+user.name+"',email='"+user.email+"',role='"+user.role+"' WHERE id="+req.params.id;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    if(err.errno === 1062){
                        sendJSONresponse(res,400,{"message" : "Duplicate user email, please try a different one."})
                    }else{
                        sendJSONresponse(res,400,{"error":err});
                    }
                }else{
                    query = "SELECT * FROM users WHERE email='"+user.email+"';"
                    con.query(query, function(err,result){
                        if(err){
                            sendJSONresponse(res,400,{"error":err});
                        }else{
                            if(result.length > 0){
                                con.end();
                                sendJSONresponse(res,200,result[0]);
                            }else{
                                con.end();
                                sendJSONresponse(res,200,{"message":"Email was not found."});
                            }
                        }
                    })
                }
            });
        }
    });
}
module.exports.deleteUser = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "DELETE FROM users WHERE id="+req.params.id;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    sendJSONresponse(res,200,{"message": "User successfully deleted."});
                }
            });
        }
    });
}