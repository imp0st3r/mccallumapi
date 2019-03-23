var express = require('express');
var router = express.Router();

var ctrlReviews = require('../controllers/reviews');
var ctrlEmail = require('../controllers/email');
var ctrlAuth = require('../controllers/auth');
var ctrlImages = require('../controllers/images');

//Reviews
router.get('/reviews', ctrlReviews.reviewsList);
router.post('/reviews', ctrlReviews.reviewsCreate);
router.get('/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/reviews/:reviewid', ctrlReviews.reviewsUpdateOne);
router.delete('/reviews/:reviewid', ctrlReviews.reviewsDeleteOne);

//Email
router.post('/sendmessage', ctrlEmail.sendMessage);

//Login
router.post('/adminlogin',ctrlAuth.adminlogin);

//Images
router.get('/images', ctrlImages.getImages);
router.post('/images', ctrlImages.createImage);
router.post('/images/upload', ctrlImages.uploadImage);
router.put('/images/:imageid', ctrlImages.updateImage);
router.delete('/images/:imageid', ctrlImages.deleteImage);

module.exports = router;