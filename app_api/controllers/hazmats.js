var mongoose = require('mongoose').set('debug', true);
var Hazmat = mongoose.model('Hazmat');
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getHazMats = function(req, res) {
    Hazmat.find().exec(function(err, hazmats){
        if(!hazmats){
            sendJsonResponse(res, 400, { "message" : "no hazmats found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            sendJsonResponse(res, 200, hazmats);
        }
    });
};

module.exports.getHazMatById = function(req, res) {
	if (req.params.id){
		Hazmat.findById(req.params.id).exec(function(err, hazmat){
            if(!hazmat){
                sendJsonResponse(res, 400, { "message" : "hazmat id not found"});
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, hazmat);
            }
        });
	} else {
		sendJsonResponse(res, 400, { "message" : "No hazmat id in request."});
	}
};

module.exports.createHazMat = function(req, res) {
	if(!req.body.ticket_id || !req.body.link ) {
		sendJsonResponse(res, 400, {"message": "All fields required"});
	return;
	}
	var hazmat = new Hazmat(req.body);
	//console.log(user);
	hazmat.save(function(err,nhazmat) {
		if (err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 200, nhazmat);
		}
	});
};
module.exports.updateHazMat = function(req, res) {
	if(!req.params.id){
		sendJsonResponse(res, 400, {"message": "Not found, hazmat id is required"});
		return;
	}
	Hazmat.findById(req.params.id).exec(function(err, hazmat) {
        if(!hazmat) {
            sendJsonResponse(res, 400, {"message" : "hazmat not found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            hazmat.ticket_id = req.body.ticket_id;
            hazmat.link = req.body.link;
            hazmat.save(function(err, nhazmat){
                if (err) {
                    sendJsonResponse(res, 400, err);
                } else {
                    sendJsonResponse(res, 200, nhazmat);
                }
            });
        }   
    });
};
module.exports.deleteHazMat = function(req, res) {
	if (req.params.id) {
		Hazmat.findByIdAndRemove(req.params.id).exec(function(err){
            if(err){
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, "Hazmat successfully deleted!");
            }
        });
	} else {
		sendJsonResponse(res, 400, {"message" : "No hazmat id"});
	}
};