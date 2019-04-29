var mysql = require('mysql');
var mysql_config = {
	host     : 'localhost',
	port     :  3306,
	user     : 'root',
	password : '!Imp0st3r1983',
	database : 'mccallum',
};
var operator = {}

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getOperators = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM operators";
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
module.exports.getOperatorById = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM operators WHERE id="+req.params.id;
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
module.exports.createOperator = function(req, res) {
    console.log(req.body);
	if(!req.body.name || !req.body.lat || !req.body.lng || !req.body.city || !req.body.state || !req.body.atf_license) {
		sendJSONresponse(res, 400, {"message": "All fields required"});
		return;
	}else{
		operator = {
			name : req.body.name,
			lat : req.body.lat,
			lng : req.body.lng,
			city : req.body.city,
            state : req.body.state,
            atf_license : req.body.atf_license
		}
		console.log(operator);
		var con = mysql.createConnection(mysql_config);
		con.connect(function(err) {
			if (err) {
				sendJSONresponse(res,400,{"error":err});
				con.end();
			}else{
				console.log("Connected!");
				var query = "INSERT INTO operators (name,lat,lng,city,state,atf_license) VALUES ('"+operator.name+"','"+operator.lat+"','"+operator.lng+"','"+operator.city+"','"+operator.state+"','"+operator.atf_license+"');";
				con.query(query, function (err, result) {
					if (err) {
                        if(err.errno === 1062){
                            sendJSONresponse(res,400,{"message" : "Duplicate ATF License, please try a different one."})
                        }else{
                            sendJSONresponse(res,400,{"error":err});
                        }
					}else{
						query = "SELECT * FROM operators WHERE atf_license='"+operator.atf_license+"';"
						con.query(query, function(err,result){
							if(err){
								sendJSONresponse(res,400,{"error":err});
							}else{
								if(result.length > 0){
									con.end();
									sendJSONresponse(res,200,result[0]);
								}else{
									con.end();
                                    sendJSONresponse(res,200,{"message":"Operator was not found."});
								}
							}
						})
					}
				});
			}
		});
	}
};

module.exports.updateOperator =function(req,res){
    operator = {
        name : req.body.name,
        lat : req.body.lat,
        lng : req.body.lng,
        city : req.body.city,
        state : req.body.state,
        atf_license : req.body.atf_license
    }
    console.log(operator);
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "UPDATE operators SET name='"+operator.name+"',lat='"+operator.lat+"',lng='"+operator.lng+"',city='"+operator.city+"',state='"+operator.state+"',atf_license='"+operator.atf_license+"' WHERE id="+req.params.id;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    if(err.errno === 1062){
                        sendJSONresponse(res,400,{"message" : "Duplicate ATF License, please try a different one."})
                    }else{
                        sendJSONresponse(res,400,{"error":err});
                    }
                }else{
                    query = "SELECT * FROM operators WHERE atf_license='"+operator.atf_license+"';"
                    con.query(query, function(err,result){
                        if(err){
                            sendJSONresponse(res,400,{"error":err});
                        }else{
                            if(result.length > 0){
                                con.end();
                                sendJSONresponse(res,200,result[0]);
                            }else{
                                con.end();
                                sendJSONresponse(res,200,{"message":"Operator was not found."});
                            }
                        }
                    })
                }
            });
        }
    });
}
module.exports.deleteOperator = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "DELETE FROM operators WHERE id="+req.params.id;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    sendJSONresponse(res,200,{"message": "Operator successfully deleted."});
                }
            });
        }
    });
}