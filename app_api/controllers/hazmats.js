var mongoose = require('mongoose').set('debug', true);
var Hazmat = mongoose.model('Hazmat');
var moment = require('moment');
var fonts = {
    Roboto: {
        normal: 'public/fonts/Roboto-Regular.ttf',
        bold: 'public/fonts/Roboto-Medium.ttf',
        italics: 'public/fonts/Roboto-Italic.ttf',
        bolditalics: 'public/fonts/Roboto-MediumItalic.ttf'
    }
}
var PDFDocument = require('pdfkit');
var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
var fs = require('fs');
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.getShippingHMDoc = function(req,res){
    console.log(req.body);
    var supplier = {};
    var operator = {};
    var tripRoute = "";
    var items = [];
    var driver = "";
    var truckNumber = "";
    var returnRoute = "";
    var dotNumber = "";
    var hazmatReg = "";
    var atfLicense = "";
    if(req.body.supplier){
        supplier = req.body.supplier;
    };
    if(req.body.operator){
        operator = req.body.operator;
    }
    if(req.body.trip_route){
        tripRoute = req.body.trip_route;
    }
    if(req.body.return_route){
        returnRoute = req.body.return_route;
    }
    if(req.body.items){
        items = req.body.items;
    }
    if(req.body.driver){
        driver = req.body.driver;
    }
    if(req.body.truckNumber){
        truckNumber = req.body.truckNumber;
    }
    if(supplier.dot_number){
        dotNumber = supplier.dot_number;
    }
    if(supplier.hazmat_reg){
        hazmatReg = supplier.hazmat_reg;
    }
    if(supplier.atf_license){
        atfLicense = supplier.atf_license;
    }
    var docDefinition = {
            pageSize: 'LETTER',
            pageMargins: [40, 80, 40, 200],
            pageOrientation: 'portrait',
            header: {
                margin: 8,
                columns: [
                    {
                        text: new moment(req.body.transaction_date).format("MM-DD-YYYY"),
                        alignment: 'center'
                    },
                    {
                        text : 'Hazardous Materials\nShipping Paper',
                        alignment : 'center',
                        fontSize : 15
                    },
                    {
                        text : req.body.customer_name,
                        alignment : 'center'
                    }
                ] 
            },
            footer: function(currentPage, pageCount) {
                return {
                    
                    stack: [
                        'This is to certify that the above named materials are properly classified, described, packaged, marked and labeled, and are in proper condition for transportation according to the applicable regulations of the Department Of Transportation.\n',
                        '\n',
                        {
                            image:'public/images/sig.png',
                            width:100,
                        },
                        '\n',
                        {
                            table: {
                                widths: [200,100,200],
                                body: [
                                    [
                                        {
                                            text: new moment(req.body.transaction_date).format("dddd") + ", " + new moment(req.body.transaction_date).format("LL"),
                                            alignment: 'left'
                                        },
                                        {
                                            text : req.body.reference_number,
                                            alignment : 'center',
                                        },
                                        {
                                            text : 'Page ' + currentPage.toString() + ' of ' + pageCount,
                                            alignment : 'right'
                                        }
                                    ]
                                ]
                            },
                            layout: 'noBorders'
                        }
                    ],
                    margin: [40,60] 
                }
            },
            content: [
                {
                    columns: [
                        {
                            text : 'Supplier:\n'+supplier.name+'\n'+supplier.address+'\n'+supplier.city+' '+supplier.state+','+supplier.zip
                        },
                        {
                            text : 'Ship To:\n'+operator.name+'\n'+operator.lat+'\n'+operator.lng+'\n'+operator.city+' '+operator.state+','+operator.zip
                        },
                        {
                            text : '\nIn Case of Emergency Contact:\nCHEMTEL: 800-255-3924\nCustomer #MIS9848041',
                            bold : true
                        } 
                    ]
                },
                {
                    columns: [
                        {
                            text : '\nDriver:'
                        },
                        {
                            text : driver
                        },
                        {
                            text : '\nTruck #:'
                        },
                        {
                            text : truckNumber
                        }
                    ]
                },
                {
                    columns : [
                        {
                            text: '\nTrip Route:',
                            width:100
                        },
                        {
                            text: '\n'+tripRoute,
                            width:350
                        }
                    ]
                },
                {
                    columns : [
                        {
                            text: '\nReturn Route:'
                        },
                        {
                            text: '\n' + returnRoute
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text : '\nU.S. DOT# ' + dotNumber,
                            fontSize: 10
                        },
                        {
                            text : '\nHAZMAT REG. ' + hazmatReg,
                            fontSize: 10
                        },
                        {
                            text : '\nATF License# ' + atfLicense,
                            fontSize: 10
                        } 
                    ],
                },
                {
                    text : '\n',
                },
                {
                    table: {
                        headerRows:1,
                        widths: [20,200,25,120,120],
                        body: [
                            [
                                '\nHM',
                                {
                                    text: '\nShipping Description',
                                    alignment: 'center'
                                },
                                {text : [{
                                    text : '\nPkg Type',
                                    fontSize : 8}]
                                },
                                {stack: [
                                        'Shipped',
                                        {
                                            table: {
                                                widths: [20,60,40],
                                                body: [
                                                    [{
                                                        text:'No Pkgs',
                                                        fontSize: 8
                                                     },{
                                                        text:'Units',
                                                        fontSize: 8
                                                     }, '']
                                                ]
                                            },
                                            layout: 'noBorders'
                                        }
                                    ]
                                },
                                {stack: [
                                        'Returned',
                                        {
                                            table: {
                                                widths: [20,60,40],
                                                body: [
                                                    [{
                                                        text:'No Pkgs',
                                                        fontSize: 8
                                                     },{
                                                        text:'Units',
                                                        fontSize: 8
                                                     }, '']
                                                ]
                                            },
                                            layout: 'noBorders'
                                        }
                                    ]
                                },
                            ],
                       ]
                    }
                },
                {
                    text : '\n',
                },
                {
                    table: {
                        headerRows:1,
                        widths: [20,200,25,100,100,30],
                        body: [
                            [
                                'HM',
                                {
                                    text: 'Shipping Description Explosive Materials',
                                    alignment: 'center'
                                },
                                {
                                    text : [
                                        {
                                            text : 'Pkg Type',
                                            fontSize : 8
                                        }
                                    ]
                                },
                                {
                                    stack: [
                                        'Shipped',
                                        {
                                            table: {
                                                widths: [20,25,30],
                                                body: [
                                                    [
                                                        {
                                                            text:'No Pkgs',
                                                            fontSize: 8
                                                        },
                                                        {
                                                            text:'Units',
                                                            fontSize: 8
                                                        },
                                                        {
                                                            text:'Net Expl Mass (lbs)',
                                                            fontSize: 8
                                                        }
                                                    ]
                                                ]
                                            },
                                            layout: 'noBorders'
                                        }
                                    ]
                                },
                                {
                                    stack: [
                                        'Returned',
                                        {
                                            table: {
                                                widths: [20,25,30],
                                                body: [
                                                    [
                                                        {
                                                            text:'No Pkgs',
                                                            fontSize: 8
                                                        },
                                                        {
                                                            text:'Units',
                                                            fontSize: 8
                                                        },
                                                        {
                                                            text:'Net Expl Mass (lbs)',
                                                            fontSize: 8
                                                        }
                                                    ]
                                                ]
                                            },
                                            layout: 'noBorders'
                                        }
                                    ]
                                },
                                {
                                    text :  'Special Permit Number',
                                    fontSize : 8
                                }
                            ]
                       ]
                    }
                }
            ]
    };
    for(var i=0;i<items.length;i++){
        console.log(items[i]);
        if(!items[i].item.explosive){
            var newItem = [
                'X',
                {stack: [
                        {
                            table: {
                                widths: [30,120,35],
                                body: [
                                    [
                                        {
                                            text:items[i].item.international_id,
                                            fontSize: 8,
                                            alignment: 'left',
                                            bold: true
                                        }, 
                                        {
                                            text:items[i].item.category,
                                            fontSize: 8,
                                            alignment: 'center',
                                            bold: true
                                        },
                                        {
                                            text: items[i].item.class,
                                            fontSize: 8,
                                            alignment: 'right',
                                            bold: true
                                        }
                                    ]
                                ]
                            },
                            layout: 'noBorders'
                        },
                        {
                            table: {
                                widths: [30,120,35],
                                body: [
                                    [
                                        {

                                        },
                                        {
                                            text: items[i].item.name,
                                            fontSize: 8,
                                            alignment:'center'
                                        },
                                        {

                                        }
                                    ]
                                ]
                            },
                            layout: 'noBorders'
                        }
                    ]
                },
                {
                    text : items[i].item.pkg_type,
                    fontSize: 8
                },
                {stack: [
                        {
                            table: {
                                widths: [20,60,40],
                                body: [
                                    [
                                        {
                                            text:Math.ceil(items[i].quantity_supplied / items[i].item.case_size),
                                            fontSize: 8
                                        }, 
                                        {
                                            text:items[i].quantity_supplied,
                                            fontSize: 8
                                        },
                                        {
                                            text: items[i].item.unit_type,
                                            fontSize: 8
                                        }
                                    ]
                                ]
                            },
                            layout: 'noBorders'
                        }
                    ]
                },
                ''
           ];
            docDefinition.content[6].table.body.push(newItem);
        }else{
            var newItem = [
                'X',
                {stack: [
                        {
                            table: {
                                widths: [30,120,35],
                                body: [
                                    [
                                        {
                                            text:items[i].item.international_id,
                                            fontSize: 8,
                                            alignment: 'left',
                                            bold: true
                                        }, 
                                        {
                                            text:items[i].item.category,
                                            fontSize: 8,
                                            alignment: 'center',
                                            bold: true
                                        },
                                        {
                                            text: items[i].item.class,
                                            fontSize: 8,
                                            alignment: 'right',
                                            bold: true
                                        }
                                    ]
                                ]
                            },
                            layout: 'noBorders'
                        },
                        {
                            table: {
                                widths: [30,120,35],
                                body: [
                                    [
                                        {
                                            text:items[i].date_code,
                                            fontSize: 6,
                                            alignment: 'left',
                                        },
                                        {
                                            text: items[i].item.name,
                                            fontSize: 8,
                                            alignment:'center'
                                        },
                                        {
                                            text: items[i].item.weight_each,
                                            fontSize: 6,
                                            alignment: 'right'
                                        }
                                    ]
                                ]
                            },
                            layout: 'noBorders'
                        }
                    ]
                },
                {
                    text : items[i].item.pkg_type,
                    fontSize: 8
                },
                {stack: [
                        {
                            table: {
                                widths: [20,25,30],
                                body: [
                                    [
                                        {
                                            text:Math.ceil(items[i].quantity_supplied / items[i].item.case_size),
                                            fontSize: 8
                                        }, 
                                        {
                                            text:items[i].quantity_supplied,
                                            fontSize: 8
                                        },
                                        {
                                            text: items[i].quantity_supplied * items[i].item.weight_each,
                                            fontSize: 8
                                        }
                                    ]
                                ]
                            },
                            layout: 'noBorders'
                        }
                    ]
                },
                {
                    text:''
                },
                {
                    text:items[i].special_permit,
                    fontSize: 8
                }
           ];
            docDefinition.content[8].table.body.push(newItem);
        }
    }
    console.log(docDefinition);
    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    var today = new Date().getTime();
    var firstName = "/var/www/html/";
    var lastName = "assets/hazmats/HM_SP_"+req.body.customer_name+"_"+today+".pdf";
    var docName = firstName + lastName;
    writeStream = fs.createWriteStream(docName);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();
    writeStream.on('finish',function(){
        sendJsonResponse(res,200,JSON.parse(JSON.stringify({"hazmatLink" : lastName})));
    })
}

module.exports.getHazMats = function(req, res) {
    Hazmat.find().exec(function(err, hazmats){
        if(!hazmats){
            sendJsonResponse(res, 400, { "message" : "no hazmats found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            sendJsonResponse(res, 200, hazmats);
        }
    });
};

module.exports.getHazMatById = function(req, res) {
	if (req.params.id){
		Hazmat.findById(req.params.id).exec(function(err, hazmat){
            if(!hazmat){
                sendJsonResponse(res, 400, { "message" : "hazmat id not found"});
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, hazmat);
            }
        });
	} else {
		sendJsonResponse(res, 400, { "message" : "No hazmat id in request."});
	}
};

module.exports.createHazMat = function(req, res) {
	if(!req.body.ticket_id || !req.body.link ) {
		sendJsonResponse(res, 400, {"message": "All fields required"});
	return;
	}
	var hazmat = new Hazmat(req.body);
	//console.log(user);
	hazmat.save(function(err,nhazmat) {
		if (err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 200, nhazmat);
		}
	});
};
module.exports.updateHazMat = function(req, res) {
	if(!req.params.id){
		sendJsonResponse(res, 400, {"message": "Not found, hazmat id is required"});
		return;
	}
	Hazmat.findById(req.params.id).exec(function(err, hazmat) {
        if(!hazmat) {
            sendJsonResponse(res, 400, {"message" : "hazmat not found"});
            return;
        } else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }else{
            hazmat.ticket_id = req.body.ticket_id;
            hazmat.link = req.body.link;
            hazmat.save(function(err, nhazmat){
                if (err) {
                    sendJsonResponse(res, 400, err);
                } else {
                    sendJsonResponse(res, 200, nhazmat);
                }
            });
        }   
    });
};
module.exports.deleteHazMat = function(req, res) {
	if (req.params.id) {
		Hazmat.findByIdAndRemove(req.params.id).exec(function(err){
            if(err){
                sendJsonResponse(res, 400, err);
                return;
            }else{
                sendJsonResponse(res, 200, "Hazmat successfully deleted!");
            }
        });
	} else {
		sendJsonResponse(res, 400, {"message" : "No hazmat id"});
	}
};