var master_password = process.env.SSAC_ADMIN_PASS;
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};
module.exports.adminlogin = function(req, res) {
    var password = req.body.password;
    console.log(password);
    if(password === master_password){
        sendJsonResponse(res,200,true);
    }else{
        sendJsonResponse(res,200,false);
    }
};