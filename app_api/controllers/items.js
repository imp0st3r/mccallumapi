var mysql = require('mysql');
var mysql_config = {
	host     : 'localhost',
	port     :  3306,
	user     : 'root',
	password : '!Imp0st3r1983',
	database : 'mccallum',
};
var item = {}

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getItems = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM items";
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
module.exports.getItemById = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "SELECT * FROM items WHERE id="+req.params.id;
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
module.exports.createItem = function(req, res) {
    console.log(req.body);
	if(!req.body.name) {
		sendJSONresponse(res, 400, {"message": "All fields required"});
		return;
	}else{
		item = {
			name : null,
            size : null,
            unit : null,
            case_size : null,
            weight_each : null,
            cs_weight : null,
            ea_weight_per_box : null,
            per_box_cs_wt : null,
            date_code : null
        }
        if(req.body.name != ""){
            if(req.body.name.indexOf("'") > -1){
                item.name = req.body.name.replace("'","''");
            }else{
                item.name = req.body.name;
            }
        }
        if(req.body.size != ""){
            if(req.body.size.indexOf("'") > -1){
                item.size = req.body.size.replace("'","''");
            }else{
                item.size = req.body.size;
            }
        }
        if(req.body.unit != ""){
            item.unit = req.body.unit;
        }
        if(req.body.case_size != ""){
            item.case_size = req.body.case_size;
        }
        if(req.body.weight_each != ""){
            item.weight_each = req.body.weight_each;
        }
        if(req.body.cs_weight != ""){
            item.cs_weight = req.body.cs_weight;
        }
        if(req.body.ea_weight_per_box != ""){
            item.ea_weight_per_box = req.body.ea_weight_per_box;
        }
        if(req.body.per_box_cs_wt != ""){
            item.cs_weight = req.body.per_box_cs_wt;
        }
        if(req.body.date_code != ""){
            item.date_code = req.body.date_code;
        }
		console.log(item);
		var con = mysql.createConnection(mysql_config);
		con.connect(function(err) {
			if (err) {
				sendJSONresponse(res,400,{"error":err});
				con.end();
			}else{
                console.log("Connected!");
                var query = "INSERT INTO items (";
                var query2 = "VALUES(";
                var count = 0;
                for(key in item){
                    if(item[key] != null){
                        if(count === 0){
                            query += key;
                            query2 += "'" + item[key] + "'";
                        }else{
                            query += "," + key;
                            query2 += ",'" + item[key] + "'";
                        }
                    }
                    count = count + 1;
                }
                query += ") ";
                query2 += ");";
                query = query + query2;
                console.log(query);
                con.query(query, function (err, result) {
					if (err) {
                        con.end();
                        sendJSONresponse(res,400,{"error":err});
					}else{
						query = "SELECT * FROM items WHERE name='"+item.name+"';"
						con.query(query, function(err,result){
							if(err){
                                con.end();
								sendJSONresponse(res,400,{"error":err});
							}else{
								if(result.length > 0){
									con.end();
									sendJSONresponse(res,200,result[0]);
								}else{
									con.end();
                                    sendJSONresponse(res,200,{"message":"Item was not found."});
								}
							}
						})
					}
				});
			}
		});
	}
};

module.exports.updateItem =function(req,res){
    item = {
        name : null,
        size : null,
        unit : null,
        case_size : null,
        weight_each : null,
        cs_weight : null,
        ea_weight_per_box : null,
        per_box_cs_wt : null,
        date_code : null
    }
    if(req.body.name != ""){
        if(req.body.name.indexOf("'") > -1){
            item.name = req.body.name.replace("'","''");
        }else{
            item.name = req.body.name;
        }
    }
    if(req.body.size != ""){
        if(req.body.size.indexOf("'") > -1){
            item.size = req.body.size.replace("'","''");
        }else{
            item.size = req.body.size;
        }
    }
    if(req.body.unit != ""){
        item.unit = req.body.unit;
    }
    if(req.body.case_size != ""){
        item.case_size = req.body.case_size;
    }
    if(req.body.weight_each != ""){
        item.weight_each = req.body.weight_each;
    }
    if(req.body.cs_weight != ""){
        item.cs_weight = req.body.cs_weight;
    }
    if(req.body.ea_weight_per_box != ""){
        item.ea_weight_per_box = req.body.ea_weight_per_box;
    }
    if(req.body.per_box_cs_wt != ""){
        item.cs_weight = req.body.per_box_cs_wt;
    }
    if(req.body.date_code != ""){
        item.date_code = req.body.date_code;
    }
    console.log(item);
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "UPDATE items SET ";
            var count = 0;
            for(key in item){
                if(item[key] != null){
                    if(count === 0){
                        query += key + "='"+item[key]+"'";
                    }else{
                        query += "," + key + "='"+item[key]+"'";
                    }
                }
                count = count + 1;
            }
            query += " WHERE id=" + req.params.id;
            console.log(query);
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    query = "SELECT * FROM items WHERE id='"+req.params.id+"';"
                    con.query(query, function(err,result){
                        if(err){
                            con.end();
                            sendJSONresponse(res,400,{"error":err});
                        }else{
                            if(result.length > 0){
                                con.end();
                                sendJSONresponse(res,200,result[0]);
                            }else{
                                con.end();
                                sendJSONresponse(res,200,{"message":"Item was not found."});
                            }
                        }
                    })
                }
            });
        }
    });
}
module.exports.deleteItem = function(req,res){
    var con = mysql.createConnection(mysql_config);
    con.connect(function(err) {
        if (err) {
            con.end();
            sendJSONresponse(res,400,{"error":err});
        }else{
            console.log("Connected!");
            var query = "DELETE FROM items WHERE id="+req.params.id;
            con.query(query, function (err, result) {
                if (err) {
                    con.end();
                    sendJSONresponse(res,400,{"error":err});
                }else{
                    con.end();
                    sendJSONresponse(res,200,{"message": "Item successfully deleted."});
                }
            });
        }
    });
}