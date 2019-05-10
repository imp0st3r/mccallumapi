var mongoose = require('mongoose');

var operatorSchema = new mongoose.Schema({
	name: String,
	lat: String,
	lng: String,
	city: String,
	state: String,
	zip: String,
	atf_license: String,
});

mongoose.model('Operator', operatorSchema, 'operators');
