var mongoose = require('mongoose').set('debug', true);
var Image = mongoose.model('Image');
var path = require('path');
var multer = require('multer');
var fs = require('fs');



var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getImages = function(req, res) {
	Image.find({},function(err, images){
			if(!images){
				sendJsonResponse(res, 200, []);
				return;
			} else if (err) {
				sendJsonResponse(res, 400, err);
				return;
			}else{
				sendJsonResponse(res, 200, images);
			}
		});
};
module.exports.createImage = function(req, res) {
    console.log(req.body);
    console.log(req.body.source);
    console.log(req.body.position);
    
	var image = new Image();

	image.source = req.body.source;
    image.position = req.body.position;
    image.enabled = true;

	image.save(function(err,image) {
		if (err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 200, image);
		}
	});
};

module.exports.updateImage = function(req, res) {
	if(!req.params.imageid){
		sendJsonResponse(res, 400, {
			"message": "Not found, imageid is required"
		});
		return;
	}
	Image.findById({_id:req.params.imageid},function(err, image) {
            if(!image) {
                sendJsonResponse(res, 400, {"message" : "imageid not found"});
            } else if (err) {
                sendJsonResponse(res, 400, err);
            }else{
                image.source = req.body.source;
                image.position = req.body.position;
                image.enabled = req.body.enabled;
                image.save(function(err, image){
                    if (err) {
                        sendJsonResponse(res, 400, err);
                    } else {
                        sendJsonResponse(res, 200, image);
                    }
                });
            }
        }
    );
};

module.exports.deleteImage = function(req, res) {
	if (req.params.imageid) {
		Image.findByIdAndRemove({_id:req.params.imageid},function(err){
					if(err){
						sendJsonResponse(res, 400, err);
						return;
					}else{
                        sendJsonResponse(res, 200, {"message":"Image successfully deleted!"});
                    }
				}
			);
	} else {
		sendJsonResponse(res, 400, {"message" : "No imageid"});
	}
};
module.exports.uploadImage = function(req,res){
	var storage = multer.diskStorage({
		destination: function(request, file, callback){
			//callback(null, '/var/www/html/assets');
			callback(null, '../ssac/src/assets/slides');
		},
		filename: function(request, file, callback){
			callback(null, file.originalname)
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