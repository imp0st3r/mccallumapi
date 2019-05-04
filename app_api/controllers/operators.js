var mongoose = require('mongoose').set('debug', true);
var Operator = mongoose.model('Operator');
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getOperators = function(req, res) {
    Operator.find().exec(function(err, operator){
        if(!operator){
            sendJsonResponse(res, 400, { "message" : "no operators found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            sendJsonResponse(res, 200, operator);
        }
    });
};

module.exports.getOperatorById = function(req, res) {
	if (req.params.id){
		Operator.findById(req.params.id).exec(function(err, operator){
            if(!operator){
                sendJsonResponse(res, 400, { "message" : "operator id not found"});
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, operator);
            }
        });
	} else {
		sendJsonResponse(res, 400, { "message" : "No operator id in request."});
	}
};

module.exports.createOperator = function(req, res) {
	if(!req.body.name || !req.body.lat || !req.body.lng || !req.body.city || !req.body.state || !req.body.atf_license) {
		sendJsonResponse(res, 400, {"message": "All fields required"});
	return;
	}
	var operator = new Operator(req.body);
	//console.log(user);
	operator.save(function(err,noperator) {
		if (err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 200, noperator);
		}
	});
};
module.exports.updateOperator = function(req, res) {
	if(!req.params.id){
		sendJsonResponse(res, 400, {"message": "Not found, operator id is required"});
		return;
	}
	Operator.findById(req.params.id).exec(function(err, operator) {
        if(!operator) {
            sendJsonResponse(res, 400, {"message" : "operator not found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            operator.name = req.body.name;
            operator.lat = req.body.lat;
            operator.lng = req.body.lng;
            operator.city = req.body.city;
            operator.state = req.body.state;
            operator.atf_license = req.body.atf_license;
            operator.save(function(err, operator){
                if (err) {
                    sendJsonResponse(res, 400, err);
                } else {
                    sendJsonResponse(res, 200, operator);
                }
            });
        }   
    });
};
module.exports.deleteOperator = function(req, res) {
	if (req.params.id) {
		Operator.findByIdAndRemove(req.params.id).exec(function(err){
            if(err){
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, "Operator successfully deleted!");
            }
        });
	} else {
		sendJsonResponse(res, 400, {"message" : "No operator id"});
	}
};