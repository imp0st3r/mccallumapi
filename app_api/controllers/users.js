var mongoose = require('mongoose').set('debug', true);
var User = mongoose.model('User');
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getUsers = function(req, res) {
    User.find().exec(function(err, user){
        if(!user){
            sendJsonResponse(res, 400, { "message" : "no users found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            var scrubbedUsers = [];
            for(var i=0;i<user.length;i++){
                var scrubbedUser = {
                    name : user.name,
                    email : user.email,
                    status : user.status,
                    role : user.role
                }
                scrubbedUsers.push(scrubbedUser);
            }
            sendJsonResponse(res, 200, scrubbedUsers);
        }
    });
};
module.exports.getUserById = function(req, res) {
	if (req.params.id){
		User.findById(req.params.id).exec(function(err, user){
            if(!user){
                sendJsonResponse(res, 400, { "message" : "userid not found"});
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }else{
                var returnUser = {
                    id : user._id,
                    name : user.name,
                    status : user.status,
                    role : user.role,
                    email : user.email
                }
                sendJsonResponse(res, 200, returnUser);
            }
        });
	} else {
		sendJsonResponse(res, 400, { "message" : "No user id in request."});
	}
};
module.exports.getUserByEmail = function(req,res){
    if(req.params.email){
        User.find({email:req.params.email}).exec(function(err,user){
            if(!user){
                sendJsonResponse(res,400,{ "message" : "No user found with requested email."});
            } else if (err){
                sendJsonResponse(res, 400, err);
            } else { 
                sendJsonResponse(res, 200, user);
            }
        })
    } else {
        sendJsonResponse(res,400, { "message" : "No email in the request."})
    }
}
module.exports.createUser = function(req, res) {
	//console.log(req);
	if(!req.body.name || !req.body.password || !req.body.email || !req.body.role) {
		sendJsonResponse(res, 400, {"message": "All fields required"});
	return;
	}
	var user = new User();

	user.name = req.body.name;

    user.setPassword(req.body.password);
    user.email = req.body.email;
    user.role = req.body.role;
	if(req.body.status){
		user.status = req.body.status;
    }else{
        user.status = "logged-out";
    }
	//console.log(user);
	user.save(function(err,user) {
		if (err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 200, user);
		}
	});
};
module.exports.updateUser = function(req, res) {
	if(!req.params.id){
		sendJsonResponse(res, 400, {"message": "Not found, userid is required"});
		return;
	}
	User.findById(req.params.id).exec(function(err, user) {
        if(!user) {
            sendJsonResponse(res, 400, {"message" : "userid not found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            user.name = req.body.name;
            user.email = req.body.email;
            user.role = req.body.role;
            if(req.body.status){
                user.status = req.body.status;
            }
            user.save(function(err, user){
                if (err) {
                    sendJsonResponse(res, 400, err);
                } else {
                    var returnUser = {
                        id : user._id,
                        name : user.name,
                        email : user.email,
                        role : user.role,
                        status : user.status
                    }
                    sendJsonResponse(res, 200, returnUser);
                }
            });
        }   
    });
};
module.exports.deleteUser = function(req, res) {
	if (req.params.id) {
		User.findByIdAndRemove(req.params.id).exec(function(err, user){
            if(err){
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, "User successfully deleted!");
            }
        });
	} else {
		sendJsonResponse(res, 400, {"message" : "No userid"});
	}
};
module.exports.resetPassword = function(req, res) {
    //console.log("CHANGING PASSWORD");
    console.log(req.body);
	User.findById(req.body.id).exec(function(err, user){
			if(!user){
				sendJsonResponse(res, 400, { "message" : "userid not found"});
				return;
			} else if (err) {
				sendJsonResponse(res, 400, err);
				return;
			}
			console.log(user);
			var returnUser = user;
			returnUser.setPassword(req.body.password);
			//console.log(returnUser);
			returnUser.save(function(err) {
				if (err) {
					sendJsonResponse(res, 400, err);
				} else {
					var returnUser2 = {
						id : returnUser._id,
                        name : returnUser.name,
                        email : returnUser.email,
                        role : returnUser.role,
						status : returnUser.status
					}
					sendJsonResponse(res, 200, returnUser2);
				}
			});
		});

}