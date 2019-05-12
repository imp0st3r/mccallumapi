var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
	name: String,
	size: String,
	unit: String,
	case_size: Number,
	weight_each: Number,
	cs_weight: Number,
	ea_weight_per_box: Number,
	per_box_cs_wt: Number,
	hazmat: Boolean,
	international_id: String,
	category: String,
	class: String,
});

mongoose.model('Item', itemSchema, 'items');
