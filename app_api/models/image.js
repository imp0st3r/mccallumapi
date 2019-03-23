var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
	source: String,
    position: Number,
    enabled: Boolean
});

mongoose.model('Image', imageSchema, 'images');
