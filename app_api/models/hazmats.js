var mongoose = require('mongoose');

var hazmatSchema = new mongoose.Schema({
	ticket_id: String,
	link: String
});

mongoose.model('Hazmat', hazmatSchema, 'hazmats');
