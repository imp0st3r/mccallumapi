var mysql = require('mysql');
var mysql_config = {
	host     : 'localhost',
	port     :  3306,
	user     : 'imp0st3r',
	password : '!Imp0st3r1983',
	database : 'mccallum',
};
var hazmat = {}

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getHazMats = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM hazmats";
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
module.exports.getHazMatById = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM hazmats WHERE id="+req.params.id;
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
module.exports.createHazMat = function(req, res) {
    console.log(req.body);
	if(!req.body.ticket_id || !req.body.link) {
		sendJSONresponse(res, 400, {"message": "All fields required"});
		return;
	}else{
		hazmat = {
			ticket_id : req.body.ticket_id,
			link : req.body.link
		}
		console.log(hazmat);
		var con = mysql.createConnection(mysql_config);
		con.connect(function(err) {
			if (err) {
				sendJSONresponse(res,400,{"error":err});
				con.end();
			}else{
				console.log("Connected!");
				var query = "INSERT INTO hazmats (ticket_id,link) VALUES ('"+hazmat.ticket_id+"','"+hazmat.link+"');";
				con.query(query, function (err, result) {
					if (err) {
                        sendJSONresponse(res,400,{"error":err});
					}else{
						query = "SELECT * FROM hazmats WHERE ticket_id='"+hazmat.ticket_id+"';"
						con.query(query, function(err,result){
							if(err){
								sendJSONresponse(res,400,{"error":err});
							}else{
								if(result.length > 0){
									con.end();
									sendJSONresponse(res,200,result[0]);
								}else{
									con.end();
                                    sendJSONresponse(res,200,{"message":"HazMat was not found."});
								}
							}
						})
					}
				});
			}
		});
	}
};

module.exports.updateHazMat =function(req,res){
    hazmat = {
        ticket_id : req.body.ticket_id,
        link : req.body.link
    }
    console.log(supplier);
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "UPDATE hazmats SET ticket_id='"+hazmat.ticket_id+"',link='"+hazmat.link+"' WHERE id="+req.params.id;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    query = "SELECT * FROM hazamats WHERE ticket_id='"+hazmat.ticket_id+"';"
                    con.query(query, function(err,result){
                        if(err){
                            sendJSONresponse(res,400,{"error":err});
                        }else{
                            if(result.length > 0){
                                con.end();
                                sendJSONresponse(res,200,result[0]);
                            }else{
                                con.end();
                                sendJSONresponse(res,200,{"message":"HazMat was not found."});
                            }
                        }
                    })
                }
            });
        }
    });
}
module.exports.deleteHazMat = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "DELETE FROM hazmats WHERE id="+req.params.id;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    sendJSONresponse(res,200,{"message": "HazMat successfully deleted."});
                }
            });
        }
    });
}