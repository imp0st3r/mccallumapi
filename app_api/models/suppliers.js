var mongoose = require('mongoose');

var supplierSchema = new mongoose.Schema({
	name: String,
	address: String,
	city: String,
	state: String,
	zip: String,
	atf_license: String,
});

mongoose.model('Supplier', supplierSchema, 'suppliers');
