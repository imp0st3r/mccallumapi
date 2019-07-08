var mongoose = require('mongoose').set('debug', true);
var Ticket = mongoose.model('Ticket');
var User = mongoose.model('User');
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

module.exports.getOpenTickets = function(req,res) {
    console.log("here");
    Ticket.find({"status":"open"},function(err,tickets){
        if(!tickets){
            sendJsonResponse(res,400,{"message": "no tickets found"})
        }else if (err){
            sendJsonResponse(res, 400, err);
        }else{
            sendJsonResponse(res,200,tickets);
        }
    })
}
module.exports.getInProgressTickets = function(req,res){
    var userid = req.params.userid;
    Ticket.find({"status":"in-progress","worker._id":userid},function(err,tickets){
        if(err){
            sendJsonResponse(res,400,err);
        }else{
            sendJsonResponse(res,200,tickets);
        }
    })
}
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
	if(!req.params.id){
		sendJsonResponse(res, 400, {"message": "Not found, ticket id is required"});
		return;
    }
    var ticket = req.body;
    Ticket.findOneAndUpdate({_id:req.params.id},ticket,{new:true},function(err,doc){
        if(err){
            console.log(err);
            sendJsonResponse(res,400,err);
        }else{
            sendJsonResponse(res,200,doc);
        }
    })
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
module.exports.acceptTicket = function(req,res){
    var userid = req.params.userid;
    var ticketid = req.params.ticketid;
    User.find({_id:userid},function(err,doc){
        if(err){
            sendJsonResponse(res,400,err);
        }else{
            var worker = doc[0];
            console.log(ticketid);
            Ticket.findById(ticketid).exec(function(err,nticket){
                if(err){
                    console.log(err);
                    sendJsonResponse(res,400,err);
                }else{
                    nticket.worker = worker;
                    nticket.status = "in-progress";
                    nticket.save(function(err,rticket){
                        if(err){
                            console.log(err);
                            sendJsonResponse(res,400,err);
                        }else{
                            sendJsonResponse(res,200,rticket);
                        }
                    }) 
                }
            })
        }
    })
}
module.exports.truckAndDriver = function(req,res){
    var ticketid = req.params.ticketid;
    Ticket.findById(ticketid).exec(function(err,nticket){
        if(err){
            console.log(err);
            sendJsonResponse(res,400,err);
        }else{
            console.log(nticket);
            nticket.driver = req.body.driver;
            nticket.truck_number = req.body.truckNumber;
            nticket.save(function(err,rticket){
                if(err){
                    console.log(err);
                    sendJsonResponse(res,400,err);
                }else{
                    sendJsonResponse(res,200,rticket);
                }
            })
        }
    })
}

module.exports.enterReceived = function(req,res){
    var ticket = req.body;
    console.log(ticket);
    Ticket.findOneAndUpdate({_id:ticket._id},ticket,{new:true},function(err,doc){
        if(err){
            console.log(err);
            sendJsonResponse(res,400,err);
        }else{
            sendJsonResponse(res,200,doc);
        }
    });
}

module.exports.enterUsed = function(req,res){
    var ticket = req.body;
    console.log(ticket);
    Ticket.findOneAndUpdate({_id:ticket._id},ticket,{new:true},function(err,doc){
        if(err){
            console.log(err);
            sendJsonResponse(res,400,err);
        }else{
            sendJsonResponse(res,200,doc);
        }
    });
}

module.exports.submitTicket = function(req,res){
    var ticket = req.body;
    ticket.status = "completed";
    console.log(ticket);

    Ticket.findOneAndUpdate({_id:ticket._id},ticket,{new:true},function(err,doc){
        if(err){
            console.log(err);
            sendJsonResponse(res,400,err);
        }else{
            sendJsonResponse(res,200,doc);
        }
    })
}
module.exports.dismissTicket = function(req,res){
    var ticketid = req.params.ticketid;
    console.log(ticketid);
    Ticket.findById(ticketid).exec(function(err,nticket){
        if(err){
            console.log(err);
            sendJsonResponse(res,400,err);
        }else{
            nticket.worker = null;
            nticket.status = "in-progress";
            nticket.save(function(err,rticket){
                if(err){
                    console.log(err);
                    sendJsonResponse(res,400,err);
                }else{
                    sendJsonResponse(res,200,rticket);
                }
            }) 
        }
    })
}
// module.exports.dismissTicket = function(res,res){
//     console.log("test");
//     console.log(req.body);
//     var ticket = req.body;
//     console.log(ticket);
//     // ticket.status = "open";
//     // ticket.worker = {
//     //     worker_id: "",
//     //     name : "",
//     //     status : "",
//     //     email: "",
//     //     role : ""
//     // };
//     // Ticket.findOneAndUpdate({_id:ticket._id},ticket,{new:true},function(err,doc){
//     //     if(err){
//     //         console.log(err);
//     //         sendJsonResponse(res,400,err);
//     //     }else{
//     //         sendJsonResponse(res,200,doc);
//     //     }
//     // })
// }