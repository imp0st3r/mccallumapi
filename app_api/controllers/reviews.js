var mongoose = require('mongoose').set('debug', true);
var Review = mongoose.model('Review');
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.reviewsList = function(req, res) {
	Review
		.find()
		.exec(function(err, reviews){
			if(!reviews){
				sendJsonResponse(res, 404, { "message" : "no reviews found"});
				return;
			} else if (err) {
				sendJsonResponse(res, 404, err);
				return;
			}else{
				sendJsonResponse(res, 200, reviews);
			}
		});
};
module.exports.reviewsCreate = function(req, res) {
	if(!req.body.author || !req.body.rating || !req.body.reviewText) {
		sendJsonResponse(res, 400, {"message": "All fields required"});
	return;
	}
	var review = new Review();

	review.author = req.body.author;
	review.rating = req.body.rating;
	review.reviewText = req.body.reviewText;

	review.save(function(err,review) {
		if (err) {
			sendJsonResponse(res, 404, err);
		} else {
			sendJsonResponse(res, 200, review);
		}
	});
};

module.exports.reviewsReadOne = function(req, res) {
	if (req.params && req.params.reviewid){
		Review
			.findById(req.params.reviewid)
			.exec(function(err, review){
				if(!review){
					sendJsonResponse(res, 404, { "message" : "review not found"});
					return;
				} else if (err) {
					sendJsonResponse(res, 404, err);
					return;
				}else{
					sendJsonResponse(res, 200, review);
				}
			});
	} else {
		sendJsonResponse(res, 404, { "message" : "No reviewid in request."});
	}
};

module.exports.reviewsUpdateOne = function(req, res) {
	if(!req.params.reviewid){
		sendJsonResponse(res, 404, {
			"message": "Not found, reviewid is required"
		});
		return;
	}
	Review
		.findById(req.params.reviewid)
		.exec(
			function(err, review) {
				if(!review) {
					sendJsonResponse(res, 404, {
						"message" : "reviewid not found"
					});
					return;
				} else if (err) {
					sendJsonResponse(res, 400, err);
					return;
				}else{
					review.author = req.body.author;
					review.rating = req.body.rating;
					review.reviewText = req.body.reviewText;
					review.save(function(err, review){
						if (err) {
							sendJsonResponse(res, 404, err);
						} else {
							sendJsonResponse(res, 200, review);
						}
					});
				}
			}
		);
};

module.exports.reviewsDeleteOne = function(req, res) {
	if (req.params.reviewid) {
		Review
			.findByIdAndRemove(req.params.reviewid)
			.exec(
				function(err){
					if(err){
						sendJsonResponse(res, 404, err);
						return;
					}
					sendJsonResponse(res, 200, {"message":"Review successfully deleted!"});
				}
			);
	} else {
		sendJsonResponse(res, 404, {
			"message" : "No userid"
		});
	}
};