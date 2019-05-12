var mongoose = require('mongoose');

var supplierSchema = new mongoose.Schema({
	name: String,
	address: String,
	city: String,
	state: String,
	zip: String,
	atf_license: String,
	dot_number: String,
	hazmat_reg : String
});

mongoose.model('Supplier', supplierSchema, 'suppliers');
