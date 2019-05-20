var mongoose = require('mongoose');


var itemSchema = new mongoose.Schema({
	item_id: String,
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
	class: String,
	explosive: Boolean
});

var itemlistSchema = new mongoose.Schema({
	item: itemSchema,
	quantity_supplied: Number,
	quantity_received: Number,
	quantity_used: Number,
	quantity_returned: Number,
	date_code: String,
	special_permit: String,
});

var hazmatSchema = new mongoose.Schema({
	link : String
});
var creatorSchema = new mongoose.Schema({
	creator_id : String,
	name : String,
	status: String,
	email: String,
	role : String
})
var workerSchema = new mongoose.Schema({
	worker_id: String,
	name : String,
	status : String,
	email: String,
	role : String
})
var supplierSchema = new mongoose.Schema({
	supplier_id : String,
	name: String,
	address: String,
	city: String,
	state: String,
	zip: String,
	atf_license: String,
	dot_number: String,
	hazmat_reg : String
})
var operatorSchema = new mongoose.Schema({
	operator_id: String,
	name: String,
	lat: String,
	lng: String,
	city: String,
	state: String,
	zip: String,
	atf_license: String,
})
var ticketSchema = new mongoose.Schema({
	creator: creatorSchema,
	driver: workerSchema,
	transaction_date: Date,
	reference_number: String,
	customer_name: String,
    job_number: Number,
    supplier: supplierSchema,
    operator: operatorSchema,
	status : String,
	items : [itemlistSchema],
	hazmat_shipping_paper : hazmatSchema,
	hazmat_return_paper : hazmatSchema,
	trip_route : String,
	return_route : String,
	driver : String,
	truck_number : String,
	hazmat_shipping_confirmation: Boolean,
	hazmat_return_confirmation: Boolean
});

mongoose.model('Ticket', ticketSchema, 'tickets');
