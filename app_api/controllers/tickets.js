var mysql = require('mysql');
var mysql_config = {
	host     : 'localhost',
	port     :  3306,
	user     : 'root',
	password : '!Imp0st3r1983',
	database : 'mccallum',
};
var ticket = {}
var moment = require('moment');
var path = require('path');
var multer = require('multer');
var fs = require('fs');

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getTickets = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM tickets";
            con.query(query, function (err, results) {
                if (err) {
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    getTicketDetails(res,results,0,function(tickets){
                        sendJSONresponse(res,200,tickets);
                    })
                }
            });
        }
    });
}
var getTicketDetails = function(res,results,position,_callback){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM itemlists WHERE ticket_id="+results[position].id+";";
            con.query(query, function (err, itemlists) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    results[position].items = itemlists;
                    console.log(itemlists);
                    var query = "SELECT * FROM hazmats WHERE ticket_id='"+results[position].id+"';";
                    con.query(query, function(err, hazmat){
                        if(err) {
                            con.end();
                            sendJSONresponse(res,400,{"error":err});
                        }else{
                            results[position].hazmat = hazmat;
                            if(position >= results.length -1){
                                _callback(results);
                            }else{
                                getTicketDetails(res,results,position+1,_callback);
                            }
                        }
                    })
                }
            });
        }
    });
}
module.exports.getTicketById = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM tickets WHERE id="+req.params.id;
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
module.exports.createTicket = function(req, res) {
    console.log(req.body);
	if(!req.body.creator_id || !req.body.reference_number || !req.body.customer_name || !req.body.job_number || !req.body.supplier_id || !req.body.operator_id) {
		sendJSONresponse(res, 400, {"message": "All fields required"});
		return;
	}else{
        console.log("creating ticket");
        var today = moment().format("YYYY-MM-DD HH:mm:ss");
        console.log(today);
		ticket = {
			creator_id : req.body.creator_id,
            transaction_date : req.body.transaction_date,
            reference_number : req.body.reference_number,
            customer_name : req.body.customer_name,
            job_number : req.body.job_number,
            supplier_id : req.body.supplier_id,
            operator_id : req.body.operator_id,
            status : "open"
		}
        console.log(ticket);
        console.log(ticket.itemlist);
		var con = mysql.createConnection(mysql_config);
		con.connect(function(err) {
			if (err) {
				sendJSONresponse(res,400,{"error":err});
				con.end();
			}else{
				console.log("Connected!");
				var query = "INSERT INTO tickets (creator_id,transaction_date,reference_number,customer_name,job_number,supplier_id,operator_id,status) VALUES ('"+ticket.creator_id+"','"+ticket.transaction_date+"','"+ticket.reference_number+"','"+ticket.customer_name+"','"+ticket.job_number+"','"+ticket.supplier_id+"','"+ticket.operator_id+"','"+ticket.status+"');";
				con.query(query, function (err, result) {
					if (err) {
                        con.end();
                        sendJSONresponse(res,400,{"error":err});
					}else{
                        query = "SELECT * FROM tickets WHERE reference_number='"+ticket.reference_number+"'";
                        con.query(query, function (err, result) {
                            if (err) {
                                con.end();
                                sendJSONresponse(res,400,{"error":err});
                            }else{
                                con.end();
                                sendJSONresponse(res,200,result[0]);
                                // addItemLists(res,result[0],ticket.itemlist,0,ticket.itemlist.length);
                            }
                        });
					}
				});
			}
		});
	}
};
module.exports.updateTicket =function(req,res){
    ticket = {
        id : req.params.id,
        creator_id : req.body.creator_id,
        transaction_date : req.body.transaction_date,
        reference_number : req.body.reference_number,
        customer_name : req.body.customer_name,
        job_number : req.body.job_number,
        supplier_id : req.body.supplier_id,
        operator_id : req.body.operator_id,
    }
    console.log(ticket);
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "UPDATE tickets SET creator_id='"+ticket.creator_id+"',transaction_date='"+ticket.transaction_date+"',reference_number='"+ticket.reference_number+"',customer_name='"+ticket.customer_name+"',job_number='"+ticket.job_number+"',supplier_id='"+ticket.supplier_id+"',operator_id='"+ticket.operator_id+"' WHERE id="+req.params.id;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    sendJSONresponse(res,200,result);
                    // updateItemLists(res,result[0],ticket.itemlist,0,ticket.itemlist.length);
                }
            });
        }
    });
}
module.exports.deleteTicket = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "DELETE FROM tickets WHERE id="+req.params.id;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    sendJSONresponse(res,200,{"message": "Ticket successfully deleted."});
                }
            });
        }
    });
}
module.exports.uploadHazMat = function(req,res){
    var today = new Date().getTime();
	var storage = multer.diskStorage({
		destination: function(request, file, callback){
			// callback(null, '/var/www/html/assets/slides');
			// callback(null, '../mccallum/src/assets/hazmats');
			callback(null, './public/uploads/hazmats');
		},
		filename: function(request, file, callback){
            var originalname = file.originalname.split(".");
            originalname = originalname[0] + "_" + today + "." + originalname[1];
			callback(null, originalname);
		}
	});
	var upload = multer({storage : storage}).single('file');

	upload(req,res,function(err){
		if(err){
			// //console.log('Error Occured: ' + err);
			sendJSONresponse(res,400,{"error":err});
		}else{
			// //console.log(req.file);
			req.file.message = "Your File Has Been Uploaded!";
			sendJSONresponse(res, 200, req.file);
		}
	})
}

module.exports.acceptTicket = function(req,res){
    var ticketid = req.params.ticketid;
    var userid = req.params.userid;
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "UPDATE tickets SET status='in-progress', worker_id='"+userid+"' WHERE id="+ticketid;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    sendJSONresponse(res,200,result);
                }
            });
        }
    });
}

module.exports.dismissTicket = function(req,res){
    var ticketid = req.params.ticketid;
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "UPDATE tickets SET status='open', worker_id=null WHERE id="+ticketid;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    sendJSONresponse(res,200,result);
                }
            });
        }
    });

}

module.exports.submitTicket = function(req,res){
    var ticketid = req.params.ticketid;
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "UPDATE tickets SET status='completed' WHERE id="+ticketid;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    sendJSONresponse(res,200,result);
                }
            });
        }
    });

}