var express = require('express');
var router = express.Router();
//for authentication
var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'payload'
});


/******ADD CONTROLLERS HERE******/
// var ctrlName = require('../controllers/controllername')
var ctrlReviews = require('../controllers/reviews');
var ctrlRecaptcha = require('../controllers/recaptcha');
var ctrlEmail = require('../controllers/email');

/******ADD API ROUTES HERE******/
// router.get('/route', ctrlName.method)

//Users
router.get('/reviews', ctrlReviews.reviewsList);
router.post('/reviews', ctrlReviews.reviewsCreate);
router.get('/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/reviews/:reviewid', ctrlReviews.reviewsUpdateOne);
router.delete('/reviews/:reviewid', ctrlReviews.reviewsDeleteOne);

router.post('/verify', ctrlRecaptcha.verifyToken);

router.post('/sendmessage', ctrlEmail.sendMessage);

module.exports = router;