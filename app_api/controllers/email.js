var nodemailer = require('nodemailer');
var uri = "https://www.google.com/recaptcha/api/siteverify";
var secret = "6LeJuZYUAAAAAOp93flIVoc9Wta8VJXKbWrk-G-N";
var request = require('request');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.sendMessage = function(req, res) {
	var userEmail = req.body;
	var headers = {
		'Content-Type' : 'application/json'
	};
	var options = {
		url: uri,
        method: 'POST',
        form:{
            response: userEmail.token,
            secret: secret
        },
		headers: headers
	};
	request(options,function(error,response,body){
		if(!error){
            var recaptchaResponse = JSON.parse(body);
            if(recaptchaResponse.success){
                var transporter = nodemailer.createTransport({
                    service: "gmail", 
                    auth: {
                        user: "ssaudioconnections2019@gmail.com",
                        pass: "!Imp0st3r1983"
                    }
                });

                var mailOptions = {
                    from: userEmail.email,
                    to: 'salessight_sound@localaccess.com',
                    subject: "New Message From ssaudioconnections.com!",
                    text: 'Name: ' + userEmail.name + '\nPhone: ' + userEmail.phone + '\nEmail: ' + userEmail.email + '\nMessage: ' + userEmail.message
                }

                transporter.sendMail(mailOptions, (error,info) => {
                    if(error) {
                        console.log(error);
                        sendJsonResponse(res,400,error); 
                    }else{
                        console.log('Message sent: %s', info.messageId);
                        sendJsonResponse(res,200,info);
                    }
                });
            }else{
                sendJsonResponse(res,400,"token invalid or expired.");
            }
		}else{
			sendJsonResponse(res,400,error);
		}
	})
};