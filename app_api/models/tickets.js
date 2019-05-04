var mongoose = require('mongoose');
var itemlistSchema = new mongoose.Schema({
	item_id: String,
	quantity_supplied: Number,
	quantity_received: Number,
	quantity_used: Number,
	quantity_returned: Number,
});
var hazmatSchema = new mongoose.Schema({
	link : String
});
var ticketSchema = new mongoose.Schema({
	creator_id: String,
	worker_id: String,
	transaction_date: Date,
	reference_number: String,
	customer_name: String,
    job_number: Number,
    supplier_id: String,
    operator_id: String,
	status : String,
	items : [itemlistSchema],
	hazmat : hazmatSchema
});

mongoose.model('Ticket', ticketSchema, 'tickets');
