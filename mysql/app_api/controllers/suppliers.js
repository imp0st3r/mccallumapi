var mysql = require('mysql');
var mysql_config = {
	host     : 'localhost',
	port     :  3306,
	user     : 'imp0st3r',
	password : '!Imp0st3r1983',
	database : 'mccallum',
};
var supplier = {}

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getSuppliers = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM suppliers";
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
module.exports.getSupplierById = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM suppliers WHERE id="+req.params.id;
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
module.exports.createSupplier = function(req, res) {
    console.log(req.body);
	if(!req.body.name || !req.body.address || !req.body.city || !req.body.state || !req.body.zip || !req.body.atf_license) {
		sendJSONresponse(res, 400, {"message": "All fields required"});
		return;
	}else{
		supplier = {
			name : req.body.name,
			address : req.body.address,
			city : req.body.city,
			state : req.body.state,
            zip : req.body.zip,
            atf_license : req.body.atf_license
		}
		console.log(supplier);
		var con = mysql.createConnection(mysql_config);
		con.connect(function(err) {
			if (err) {
				sendJSONresponse(res,400,{"error":err});
				con.end();
			}else{
				console.log("Connected!");
				var query = "INSERT INTO suppliers (name,address,city,state,zip,atf_license) VALUES ('"+supplier.name+"','"+supplier.address+"','"+supplier.city+"','"+supplier.state+"','"+supplier.zip+"','"+supplier.atf_license+"');";
				con.query(query, function (err, result) {
					if (err) {
                        if(err.errno === 1062){
                            sendJSONresponse(res,400,{"message" : "Duplicate ATF License, please try a different one."})
                        }else{
                            sendJSONresponse(res,400,{"error":err});
                        }
					}else{
						query = "SELECT * FROM suppliers WHERE atf_license='"+supplier.atf_license+"';"
						con.query(query, function(err,result){
							if(err){
								sendJSONresponse(res,400,{"error":err});
							}else{
								if(result.length > 0){
									con.end();
									sendJSONresponse(res,200,result[0]);
								}else{
									con.end();
                                    sendJSONresponse(res,200,{"message":"Supplier was not found."});
								}
							}
						})
					}
				});
			}
		});
	}
};

module.exports.updateSupplier =function(req,res){
    supplier = {
        name : req.body.name,
        address : req.body.address,
        city : req.body.city,
        state : req.body.state,
        zip : req.body.zip,
        atf_license : req.body.atf_license
    }
    console.log(supplier);
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "UPDATE suppliers SET name='"+supplier.name+"',address='"+supplier.address+"',state='"+supplier.state+"',city='"+supplier.city+"',zip='"+supplier.zip+"',atf_license='"+supplier.atf_license+"' WHERE id="+req.params.id;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    if(err.errno === 1062){
                        sendJSONresponse(res,400,{"message" : "Duplicate ATF License, please try a different one."})
                    }else{
                        sendJSONresponse(res,400,{"error":err});
                    }
                }else{
                    query = "SELECT * FROM suppliers WHERE atf_license='"+supplier.atf_license+"';"
                    con.query(query, function(err,result){
                        if(err){
                            sendJSONresponse(res,400,{"error":err});
                        }else{
                            if(result.length > 0){
                                con.end();
                                sendJSONresponse(res,200,result[0]);
                            }else{
                                con.end();
                                sendJSONresponse(res,200,{"message":"Supplier was not found."});
                            }
                        }
                    })
                }
            });
        }
    });
}
module.exports.deleteSupplier = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "DELETE FROM suppliers WHERE id="+req.params.id;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    sendJSONresponse(res,200,{"message": "Supplier successfully deleted."});
                }
            });
        }
    });
}