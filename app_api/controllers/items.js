var mongoose = require('mongoose').set('debug', true);
var Item = mongoose.model('Item');
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getItems = function(req, res) {
    Item.find().exec(function(err, items){
        if(!items){
            sendJsonResponse(res, 400, { "message" : "no items found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            sendJsonResponse(res, 200, items);
        }
    });
};

module.exports.getItemById = function(req, res) {
	if (req.params.id){
		Item.findById(req.params.id).exec(function(err, item){
            if(!user){
                sendJsonResponse(res, 400, { "message" : "item id not found"});
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, item);
            }
        });
	} else {
		sendJsonResponse(res, 400, { "message" : "No item id in request."});
	}
};

module.exports.createItem = function(req, res) {
	if(!req.body.name) {
		sendJsonResponse(res, 400, {"message": "All fields required"});
	return;
	}
	var item = new Item(req.body);
	//console.log(user);
	item.save(function(err,nitem) {
		if (err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 200, nitem);
		}
	});
};
module.exports.updateItem = function(req, res) {
	if(!req.params.id){
		sendJsonResponse(res, 400, {"message": "Not found, item id is required"});
		return;
	}
	Item.findById(req.params.id).exec(function(err, item) {
        if(!item) {
            sendJsonResponse(res, 400, {"message" : "item not found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            console.log(req.body);
            item.name = req.body.name;
            if(req.body.size){
                item.size = req.body.size;
            }
            if(req.body.unit){
                item.unit = req.body.unit;
            }
            if(req.body.case_size){
                item.case_size = req.body.case_size;
            }
            if(req.body.weight_each){
                item.weight_each = req.body.weight_each;
            }
            if(req.body.cs_weight){
                item.cs_weight = req.body.cs_weight;
            }
            if(req.body.ea_weight_per_box){
                item.ea_weight_per_box = req.body.ea_weight_per_box;
            }
            if(req.body.per_box_cs_wt){
                item.per_box_cs_wt = req.body.per_box_cs_wt;
            }
            if(req.body.hazmat){
                item.hazmat = req.body.hazmat;
            }
            if(req.body.international_id){
                item.international_id = req.body.international_id;
            }
            if(req.body.category){
                item.category = req.body.category;
            }
            if(req.body.class){
                item.class = req.body.class;
            }
            item.save(function(err, nitem){
                if (err) {
                    sendJsonResponse(res, 400, err);
                } else {
                    sendJsonResponse(res, 200, nitem);
                }
            });
        }   
    });
};
module.exports.deleteItem = function(req, res) {
	if (req.params.id) {
		Item.findByIdAndRemove(req.params.id).exec(function(err){
            if(err){
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, "Item successfully deleted!");
            }
        });
	} else {
		sendJsonResponse(res, 400, {"message" : "No item id"});
	}
};