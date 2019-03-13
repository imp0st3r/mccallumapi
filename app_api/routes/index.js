var express = require('express');
var router = express.Router();

var ctrlReviews = require('../controllers/reviews');
var ctrlEmail = require('../controllers/email');

//Users
router.get('/reviews', ctrlReviews.reviewsList);
router.post('/reviews', ctrlReviews.reviewsCreate);
router.get('/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/reviews/:reviewid', ctrlReviews.reviewsUpdateOne);
router.delete('/reviews/:reviewid', ctrlReviews.reviewsDeleteOne);

router.post('/sendmessage', ctrlEmail.sendMessage);

module.exports = router;