var mongoose = require('mongoose').set('debug', true);
var Ticket = mongoose.model('Ticket');
var Itemlist = mongoose.model('Itemlist');
var Hazmat = mongoose.model('Hazmat');
var moment = require('moment');
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getTickets = function(req, res) {
    Ticket.find().exec(function(err, tickets){
        if(!tickets){
            sendJsonResponse(res, 400, { "message" : "no tickets found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            sendJsonResponse(res,200,tickets);
        }
    });
};
module.exports.getTicketById = function(req, res) {
	if (req.params.id){
		Ticket.findById(req.params.id).exec(function(err, ticket){
            if(!user){
                sendJsonResponse(res, 400, { "message" : "ticket id not found"});
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, ticket);
            }
        });
	} else {
		sendJsonResponse(res, 400, { "message" : "No ticket id in request."});
	}
};

module.exports.createTicket = function(req, res) {
	//console.log(req);
    var ticket = new Ticket(req.body);
    ticket.status = "open";
	console.log(ticket);
	ticket.save(function(err,nticket) {
		if (err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 200, nticket);
		}
	});
};
module.exports.updateTicket = function(req, res) {
    console.log(req.body);
	if(!req.params.id){
		sendJsonResponse(res, 400, {"message": "Not found, ticket id is required"});
		return;
	}
	Ticket.findById(req.params.id).exec(function(err, ticket) {
        if(!ticket) {
            sendJsonResponse(res, 400, {"message" : "ticket not found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            ticket.creator_id = req.body.creator_id;
            if(req.body.worker_id){
                ticket.worker_id = req.body.worker_id;
            }
            if(req.body.transaction_date){
                ticket.transaction_date = req.body.transaction_date;
            }
            if(req.body.reference_number){
                ticket.reference_number = req.body.reference_number;
            }
            if(req.body.customer_name){
                ticket.customer_name = req.body.customer_name;
            }
            if(req.body.job_number){
                ticket.job_number = req.body.job_number;
            }
            if(req.body.supplier_id){
                ticket.supplier_id = req.body.supplier_id;
            }
            if(req.body.operator_id){
                ticket.operator_id = req.body.operator_id;
            }
            if(req.body.items){
                ticket.items = req.body.items;
            }
            if(req.body.hazmat){
                ticket.hazmat = req.body.hazmat;
            }
            if(req.body.status){
                ticket.status = req.body.status;
            }else{
                ticket.status = "open";
            }
            ticket.save(function(err, nticket){
                if (err) {
                    sendJsonResponse(res, 400, err);
                } else {
                    sendJsonResponse(res, 200, nticket);
                }
            });
        }   
    });
};
module.exports.deleteTicket = function(req, res) {
	if (req.params.id) {
		Ticket.findByIdAndRemove(req.params.id).exec(function(err){
            if(err){
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, "Ticket successfully deleted!");
            }
        });
	} else {
		sendJsonResponse(res, 400, {"message" : "No ticket id"});
	}
};
module.exports.uploadHazMat = function(req,res){
    var today = new Date().getTime();
	var storage = multer.diskStorage({
		destination: function(request, file, callback){
			// callback(null, '/var/www/html/assets/slides');
			callback(null, '/var/www/html/assets/hazmats');
			// callback(null, './public/uploads/hazmats');
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
			sendJsonResponse(res,400,{"error":err});
		}else{
			// //console.log(req.file);
			req.file.message = "Your File Has Been Uploaded!";
			sendJsonResponse(res, 200, req.file);
		}
	})
}