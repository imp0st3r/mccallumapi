var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
	name: String,
	size: String,
	unit_type: String,
	pkg_type: String,
	case_size: Number,
	weight_each: Number,
	cs_weight: Number,
	ea_weight_per_box: Number,
	per_box_cs_wt: Number,
	hazmat: Boolean,
	international_id: String,
	category: String,
	hazmat_class: String,
	explosive: Boolean
});

mongoose.model('Item', itemSchema, 'items');
