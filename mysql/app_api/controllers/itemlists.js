var mysql = require('mysql');
var mysql_config = {
	host     : 'localhost',
	port     :  3306,
	user     : 'imp0st3r',
	password : '!Imp0st3r1983',
	database : 'mccallum',
};
var itemlist = {}

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getItemlists = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM itemlists;";
            con.query(query, function (err, results) {
                if (err) {
                    con.end();
                    console.log(err);
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    sendJSONresponse(res,200,results);
                }
            });
        }
    });
}
module.exports.getItemlistsByTicketId = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM itemlists WHERE ticket_id="+req.params.id+";";
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
module.exports.createItemlist = function(req, res) {
    console.log(req.body);
    addItemlist(res,req.body,req.body.length-1,function(ticketid){
        var con = mysql.createConnection(mysql_config);
        con.connect(function(err){
            if(err){
                con.end();
                sendJSONresponse(res,400,{"error":err});
            }else{
                console.log("Connected!");
                var query = "SELECT * FROM itemlists WHERE ticket_id="+ticketid+";";
                con.query(query, function(err, result){
                    if(err){
                        con.end();
                        sendJSONresponse(res,400,{"error":err});
                    }else{
                        con.end();
                        sendJSONresponse(res,200,result);
                    }
                })
            }
        })
    })
};
var addItemlist = function(res,itemlists,itemnum,_callback){
    console.log(itemlists);
    console.log(itemnum);
    console.log(itemlists[itemnum]);
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            console.log(itemlists);
            console.log(itemnum);
            var query = "INSERT INTO itemlists (ticket_id,item_id,quantity_supplied) VALUES ('"+itemlists[itemnum].ticket_id+"','"+itemlists[itemnum].item_id+"','"+itemlists[itemnum].quantity_supplied+"');";
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    if(itemnum > 0){
                        con.end();
                        let nextitemnum = itemnum -1;
                        console.log(nextitemnum);
                        addItemlist(res,itemlists,nextitemnum,_callback);
                    }else{
                        con.end();
                        _callback(itemlists[itemnum].ticket_id);
                    }
                }
            });
        }
    });
}
var editItemlist = function(res,itemlists,itemnum,_callback){
    var itemlist = {
        id : itemlists[itemnum].id,
        ticket_id : itemlists[itemnum].ticket_id,
        item_id : itemlists[itemnum].item_id,
        quantity_supplied : itemlists[itemnum].quantity_supplied
    }
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            console.log(itemlists);
            console.log(itemnum);
            console.log(itemlists[itemnum]);
            var query = "UPDATE itemlists SET item_id='"+itemlist.item_id+"', quantity_supplied='"+itemlist.quantity_supplied+"' WHERE id="+itemlist.id+";";
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    if(itemnum > 0){
                        con.end();
                        let nextitemnum = itemnum -1;
                        console.log(nextitemnum);
                        editItemlist(res,itemlists,nextitemnum,_callback);
                    }else{
                        con.end();
                        _callback(itemlists[itemnum].ticket_id);
                    }
                }
            });
        }
    });
}
module.exports.updateItemlist =function(req,res){
    console.log(req.body);
    editItemlist(res,req.body,req.body.length-1,function(ticketid){
        var con = mysql.createConnection(mysql_config);
        con.connect(function(err){
            if(err){
                con.end();
                sendJSONresponse(res,400,{"error":err});
            }else{
                console.log("Connected!");
                var query = "SELECT * FROM itemlists WHERE ticket_id="+ticketid+";";
                con.query(query, function(err, result){
                    if(err){
                        con.end();
                        sendJSONresponse(res,400,{"error":err});
                    }else{
                        con.end();
                        sendJSONresponse(res,200,result);
                    }
                })
            }
        })
    })
}
module.exports.deleteItemlist = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "DELETE FROM itemlists WHERE id="+req.params.id;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    sendJSONresponse(res,200,{"message": "Itemlist successfully deleted."});
                }
            });
        }
    });
}

module.exports.addReceived = function(req,res){
    var itemlist = req.body;
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "Update itemlists SET quantity_received="+itemlist.quantity_received+" WHERE id="+req.body.id;
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
module.exports.addUsed = function(req,res){
    var itemlist = req.body;
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "Update itemlists SET quantity_used="+itemlist.quantity_used+" WHERE id="+req.body.id;
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
module.exports.addReturned = function(req,res){
    var itemlist = req.body;
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "Update itemlists SET quantity_returned="+itemlist.quantity_returned+" WHERE id="+req.body.id;
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