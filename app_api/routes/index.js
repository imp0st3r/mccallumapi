var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');

var ctrlAuth = require('../controllers/auth');
var ctrlUsers = require('../controllers/users');
var ctrlSups = require('../controllers/suppliers');
var ctrlOps = require('../controllers/operators');
var ctrlItems = require('../controllers/items');
var ctrlItemlists = require('../controllers/itemlists');
var ctrlHMs = require('../controllers/hazmats');
var ctrlTickets = require('../controllers/tickets');

//Authentication
router.post('/login', ctrlAuth.login);

//Users
router.get('/users',ctrlUsers.getUsers);
router.get('/users/:id',ctrlUsers.getUserById);
router.post('/users',ctrlUsers.createUser);
router.put('/users/:id',ctrlUsers.updateUser);
router.delete('/users/:id',ctrlUsers.deleteUser);
router.post('/users/resetpass/:id',ctrlUsers.resetPassword);
router.get('/users/getuserbyemail/:email',ctrlUsers.getUserByEmail);

//Suppliers
router.get('/suppliers', ctrlSups.getSuppliers);
router.get('/suppliers/:id',ctrlSups.getSupplierById);
router.post('/suppliers',ctrlSups.createSupplier);
router.put('/suppliers/:id',ctrlSups.updateSupplier);
router.delete('/suppliers/:id',ctrlSups.deleteSupplier);

//Operators
router.get('/operators',ctrlOps.getOperators);
router.get('/operators/:id',ctrlOps.getOperatorById);
router.post('/operators',ctrlOps.createOperator);
router.put('/operators/:id',ctrlOps.updateOperator);
router.delete('/operators/:id',ctrlOps.deleteOperator);

//Items
router.get('/items', ctrlItems.getItems);
router.get('/items/:id', ctrlItems.getItemById);
router.post('/items', ctrlItems.createItem);
router.put('/items/:id', ctrlItems.updateItem);
router.delete('/items/:id', ctrlItems.deleteItem);

//Itemlists
router.get('/itemlists', ctrlItemlists.getItemlists);
router.get('/itemlists/:id', ctrlItemlists.getItemlistsByTicketId);
router.post('/itemlists', ctrlItemlists.createItemlist);
router.put('/itemlists', ctrlItemlists.updateItemlist);
router.delete('/itemlists/:id', ctrlItemlists.deleteItemlist);

//Hazmats
router.get('/hazmats', ctrlHMs.getHazMats);
router.get('/hazmats/:id', ctrlHMs.getHazMatById);
router.post('/hazmats', ctrlHMs.createHazMat);
router.put('/hazmats/:id', ctrlHMs.updateHazMat);
router.delete('/hazmats/:id', ctrlHMs.deleteHazMat);
router.post('/getShippingHMDoc', ctrlHMs.getShippingHMDoc);
router.post('/getReturnHMDoc', ctrlHMs.getReturnHMDoc);

//Tickets
router.get('/tickets', ctrlTickets.getTickets);
router.get('/tickets/:id', ctrlTickets.getTicketById);
router.post('/tickets',ctrlTickets.createTicket);
router.put('/tickets/:id',ctrlTickets.updateTicket);
router.delete('/tickets/:id',ctrlTickets.deleteTicket);
router.post('/uploadhazmat',ctrlTickets.uploadHazMat);
router.get('/getopentickets', ctrlTickets.getOpenTickets);
router.get('/getinprogresstickets/:userid', ctrlTickets.getInProgressTickets);
router.get('/acceptticket/:ticketid/:userid',ctrlTickets.acceptTicket);
router.post('/truckanddriver/:ticketid',ctrlTickets.truckAndDriver);
router.post('/enterreceived',ctrlTickets.enterReceived);
router.post('/enterused',ctrlTickets.enterUsed);
router.post('/submitticket',ctrlTickets.submitTicket);
router.get('/dismissticket/:ticketid',ctrlTickets.dismissTicket);





module.exports = router;