var uri = "https://www.google.com/recaptcha/api/siteverify";
var secret = "6LeJuZYUAAAAAOp93flIVoc9Wta8VJXKbWrk-G-N";
var request = require('request');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.verifyToken = function(req, res) {
	console.log(req.body)
	var headers = {
		'Content-Type' : 'application/json'
	};
	var options = {
		url: uri,
        method: 'POST',
        form:{
            response: req.body.response,
            secret: secret
        },
		headers: headers
	};
	request(options,function(error,response,body){
		if(!error){
            sendJsonResponse(res,200,body);
		}else{
			sendJsonResponse(res,400,error);
		}
	})
};