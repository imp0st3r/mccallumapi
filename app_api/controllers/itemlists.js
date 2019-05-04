var mongoose = require('mongoose').set('debug', true);
var Itemlist = mongoose.model('Itemlist');
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getItemlists = function(req, res) {
    Itemlist.find().exec(function(err, itemlists){
        if(!itemlists){
            sendJsonResponse(res, 400, { "message" : "no itemlists found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            sendJsonResponse(res, 200, itemlists);
        }
    });
};

module.exports.getItemlistsByTicketId = function(req, res) {
	if (req.params.id){
		Itemlist.find({"ticket_id":req.params.id}).exec(function(err, itemlist){
            if(!itemlist){
                sendJsonResponse(res, 400, { "message" : "itemlist id not found"});
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, itemlist);
            }
        });
	} else {
		sendJsonResponse(res, 400, { "message" : "No itemlist id in request."});
	}
};

module.exports.createItemlist = function(req, res) {
    console.log(req.body);
    addItemlist(res,req.body,req.body.length-1,function(ticketid){
        Itemlist.find({"ticket_id":ticketid}).exec(function(err,itemlists){
            if(err){
                sendJsonResponse(res,400,err);
            }else{
                sendJsonResponse(res,200,itemlists);
            }
        })
    })
};
var addItemlist = function(res,itemlists,itemnum,_callback){
    console.log(itemlists);
    console.log(itemnum);
    console.log(itemlists[itemnum]);
    var itemlist = new Itemlist(itemlists[itemnum]);
    itemlist.save(function(err,nitemlist) {
        if(err){
            sendJsonResponse(res,400,err);
        }else{
            if(itemnum > 0){
                let nextitemnum = itemnum -1;
                addItemlist(res,itemlists,nextitemnum,_callback);
            }else{
                _callback(itemlists[itemnum].ticket_id);
            }
        }
    })
}
// module.exports.createItemlist = function(req, res) {
// 	if(!req.body.ticket_id || !req.body.item_id || !req.body.quantity_supplied) {
// 		sendJsonResponse(res, 400, {"message": "All fields required"});
// 	return;
// 	}
// 	var itemlist = new Itemlist(req.body);
// 	//console.log(user);
// 	itemlist.save(function(err,nitemlist) {
// 		if (err) {
// 			sendJsonResponse(res, 400, err);
// 		} else {
// 			sendJsonResponse(res, 200, nitemlist);
// 		}
// 	});
// };
var editItemlist = function(res,itemlists,itemnum,_callback){
    var itemlist = {
        id : itemlists[itemnum]._id,
        ticket_id : itemlists[itemnum].ticket_id,
        item_id : itemlists[itemnum].item_id,
        quantity_supplied : itemlists[itemnum].quantity_supplied
    }
    itemlist.save().exec(function(err,itemlist){
        if(err){
            sendJsonResponse(res,400,err);
        }else{
            if(itemnum > 0){
                let nextitemnum = itemnum -1;
                editItemlist(res,itemlists,nextitemnum,_callback);
            }else{
                _callback(itemlists[itemnum].ticket_id);
            }
        }
    })
}
module.exports.updateItemlist =function(req,res){
    console.log(req.body);
    editItemlist(res,req.body,req.body.length-1,function(ticketid){
        Itemlist.find({"ticket_id":ticketid}).exec(function(err,itemlists){
            if(err){
                sendJsonResponse(res,400,err);
            }else{
                sendJsonResponse(res,200,itemlists);
            }
        })
    })
}
module.exports.updateItemlist = function(req, res) {
	if(!req.params.id){
		sendJsonResponse(res, 400, {"message": "Not found, itemlist id is required"});
		return;
	}
	Itemlist.findById(req.params.id).exec(function(err, itemlist) {
        if(!itemlist) {
            sendJsonResponse(res, 400, {"message" : "itemlist not found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            itemlist.ticket_id = req.body.ticket_id;
            itemlist.item_id = req.body.item_id;
            itemlist.quantity_supplied = req.body.quantity_supplied;
            if(req.body.quantity_received){
                itemlist.quantity_received = req.body.quantity_received;
            }
            if(req.body.quantity_used){
                itemlist.quantity_used = req.body.quantity_used;
            }
            if(req.body.quantity_returned){
                itemlist.quantity_returned = req.body.quantity_returned;
            }
            itemlist.save(function(err, nitemlist){
                if (err) {
                    sendJsonResponse(res, 400, err);
                } else {
                    sendJsonResponse(res, 200, nitemlist);
                }
            });
        }   
    });
};
module.exports.deleteItemlist = function(req, res) {
	if (req.params.id) {
		Itemlist.findByIdAndRemove(req.params.id).exec(function(err){
            if(err){
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, "Itemlist successfully deleted!");
            }
        });
	} else {
		sendJsonResponse(res, 400, {"message" : "No itemlist id"});
	}
};