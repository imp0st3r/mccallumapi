var mongoose = require('mongoose').set('debug', true);
var Supplier = mongoose.model('Supplier');
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getSuppliers = function(req, res) {
    Supplier.find().exec(function(err, supplier){
        if(!supplier){
            sendJsonResponse(res, 400, { "message" : "no suppliers found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            sendJsonResponse(res, 200, supplier);
        }
    });
};

module.exports.getSupplierById = function(req, res) {
	if (req.params.id){
		Supplier.findById(req.params.id).exec(function(err, supplier){
            if(!supplier){
                sendJsonResponse(res, 400, { "message" : "supplier id not found"});
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, supplier);
            }
        });
	} else {
		sendJsonResponse(res, 400, { "message" : "No supplier id in request."});
	}
};

module.exports.createSupplier = function(req, res) {
	//console.log(req);
	if(!req.body.name || !req.body.address || !req.body.city || !req.body.state || !req.body.zip || !req.body.atf_license) {
		sendJsonResponse(res, 400, {"message": "All fields required"});
	return;
	}
	var supplier = new Supplier(req.body);
	//console.log(user);
	supplier.save(function(err,nsupplier) {
		if (err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 200, nsupplier);
		}
	});
};
module.exports.updateSupplier = function(req, res) {
	if(!req.params.id){
		sendJsonResponse(res, 400, {"message": "Not found, supplier id is required"});
		return;
	}
	Supplier.findById(req.params.id).exec(function(err, supplier) {
        if(!supplier) {
            sendJsonResponse(res, 400, {"message" : "supplier not found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            supplier.name = req.body.name;
            supplier.address = req.body.address;
            supplier.city = req.body.city;
            supplier.state = req.body.state;
            supplier.zip = req.body.zip;
            supplier.atf_license = req.body.atf_license;
            supplier.save(function(err, supplier){
                if (err) {
                    sendJsonResponse(res, 400, err);
                } else {
                    sendJsonResponse(res, 200, supplier);
                }
            });
        }   
    });
};
module.exports.deleteSupplier = function(req, res) {
	if (req.params.id) {
		Supplier.findByIdAndRemove(req.params.id).exec(function(err){
            if(err){
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, "Supplier successfully deleted!");
            }
        });
	} else {
		sendJsonResponse(res, 400, {"message" : "No supplier id"});
	}
};