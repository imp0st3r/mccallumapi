var mongoose = require('mongoose');

var itemlistSchema = new mongoose.Schema({
	ticket_id: String,
	item_id: String,
	quantity_supplied: Number,
	quantity_received: Number,
	quantity_used: Number,
	quantity_returned: Number,
});

mongoose.model('Itemlist', itemlistSchema, 'itemlists');
