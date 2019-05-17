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
function createPdfBinary(pdfDoc, callback) {
console.log(pdfDoc);

// var chunks = [];
// var result;

// doc.on('data', function (chunk) {
//     console.log(chunk);
//     chunks.push(chunk);
// });
// doc.on('end', function () {
//     result = Buffer.concat(chunks);
//     callback('data:application/pdf;base64,' + result.toString('base64'));
// });
// doc.end();

}

module.exports.getHMDoc = function(req,res){
    // var doc = new PDFDocument;
    // doc.pipe(fs.createWriteStream('public/hazmats/test.pdf'));
    // doc.pipe(res);
    // doc.text('test');
    // doc.end();
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
    console.log("Supplier: ", supplier);
    console.log("Operator: ", operator);
    console.log("Trip Route: ", tripRoute);
    console.log("Items: ", items); 
    var docDefinition = {
            pageSize: 'LEGAL',
            pageMargins: [40, 80, 40, 60],
            pageOrientation: 'portrait',
            header: {
                margin: 8,
                columns: [
                    {
                        text: new moment(req.body.transactionDate).format("MM-DD-YYYY"),
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
                    text:''
                }
           ];
            docDefinition.content[8].table.body.push(newItem);
        }
    }
    console.log(docDefinition);
    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('public/hazmats/test.pdf'));
    pdfDoc.end();
    // console.log("DOC DEF: ",docDefinition);
    // var pdf = printer.createPdfKitDocument(docDefinition);
    // pdf.pipe(fs.createWriteStream('test.pdf'));
    // pdf.pipe(res);
    // pdf.end();
    // var dd = {
    //     header: {
    //         columns: [
    //             {
    //                 text: new moment(req.body.transactionDate).format("MM-DD-YYYY"),
    //                 alignment: 'left'
    //             },
    //             {
    //                 text : 'Hazardous Materials Shipping Paper',
    //                 alignment : 'center',
    //                 fontSize : 15
    //             },
    //             {
    //                 text : req.body.customer_name,
    //                 alignment : 'right'
    //             }
    //         ] 
    //     },
    //     content: [
    //         {
    //             columns: [
    //                 {
    //                     text : '\nSupplier:\n'+supplier.name+'\n'+supplier.address+'\n'+supplier.city+' '+supplier.state+','+supplier.zip
    //                 },
    //                 {
    //                     text : '\nShip To:\n'+operator.name+'\n'+operator.lat+'\n'+operator.lng+'\n'+operator.city+' '+operator.state+','+operator.zip
    //                 },
    //                 {
    //                     text : '\n\nIn Case of Emergency Contact:\nCHEMTEL: 800-255-3924\nCustomer #MIS9848041',
    //                     bold : true
    //                 } 
    //             ]
    //         },
    //         {
    //             columns: [
    //                 {
    //                     text : '\nDriver:'
    //                 },
    //                 {
    //                     text : ''
    //                 },
    //                 {
    //                     text : '\nTruck #:'
    //                 },
    //                 {
    //                     text : ''
    //                 }
    //             ]
    //         },
    //         {
    //             text: '\nTrip Route: S to NE Ouaale W to Clark S to US-97 SE to US-26 NW to 9th NE to Main NE to 7 NE to Stearn E to US-26 W to Ochoco Crk E to Petersn Crk Paulina Highway',
    //         },
    //         {
    //             text: '\nReturn Route: '
    //         },
    //         {
    //             columns: [
    //                 {
    //                     text : '\nU.S. DOT# 2901440',
    //                     fontSize: 10
    //                 },
    //                 {
    //                     text : '\nHAZMAT REG. 081016 550 008Y A',
    //                     fontSize: 10
    //                 },
    //                 {
    //                     text : '\nATF License# 9-WA-041-20-9K-0',
    //                     fontSize: 10
    //                 } 
    //             ],
    //         },
    //         {
    //             text : '\n',
    //         },
    //         {
    //             table: {
    //                 headerRows:1,
    //                 widths: [20,160,25,120,120],
    //                 body: [
    //                     [
    //                         'HM',
    //                         {
    //                             text: 'Shipping Description',
    //                             alignment: 'center'
    //                         },
    //                         {text : [{
    //                             text : 'Pkg Type',
    //                             fontSize : 8}]
    //                         },
    //                         {stack: [
    //                                 'Shipped',
    //                                 {
    //                                     table: {
    //                                         widths: [40,40,40],
    //                                         body: [
    //                                             [{
    //                                                 text:'No Pkgs',
    //                                                 fontSize: 8
    //                                              },{
    //                                                 text:'Units',
    //                                                 fontSize: 8
    //                                              }, '']
    //                                         ]
    //                                     },
    //                                     layout: 'noBorders'
    //                                 }
    //                             ]
    //                         },
    //                         {stack: [
    //                                 'Returned',
    //                                 {
    //                                     table: {
    //                                         widths: [40,40,40],
    //                                         body: [
    //                                             [{
    //                                                 text:'No Pkgs',
    //                                                 fontSize: 8
    //                                              },{
    //                                                 text:'Units',
    //                                                 fontSize: 8
    //                                              }, '']
    //                                         ]
    //                                     },
    //                                     layout: 'noBorders'
    //                                 }
    //                             ]
    //                         },
    //                     ],
    //                     [
    //                         'X',
    //                         {stack: [
    //                                 {
    //                                     table: {
    //                                         body: [
    //                                             [
    //                                                 {
    //                                                     text:'UN2790',
    //                                                     fontSize: 8
    //                                                 }, 
    //                                                 {
    //                                                     text:'Acedic Acid Solution',
    //                                                     fontSize: 8
    //                                                 },
    //                                                 {
    //                                                     text: '8 PGII',
    //                                                     fontSize: 8
    //                                                 }
    //                                             ]
    //                                         ]
    //                                     },
    //                                     layout: 'noBorders'
    //                                 },
    //                                 {
    //                                     table: {
    //                                         body: [
    //                                             [
    //                                                 {
    //                                                     text:'Acetic Acid 50-56%',
    //                                                     fontSize: 8,
    //                                                     bold: true,
    //                                                     alignment:'center'
    //                                                 }
    //                                             ]
    //                                         ]
    //                                     },
    //                                     layout: 'noBorders'
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             text : 'Tank',
    //                             fontSize: 10
    //                         },
    //                         {stack: [
    //                                 {
    //                                     table: {
    //                                         widths: [40,40,40],
    //                                         body: [
    //                                             [
    //                                                 {
    //                                                     text:1,
    //                                                     fontSize: 10
    //                                                 }, 
    //                                                 {
    //                                                     text:80,
    //                                                     fontSize: 10
    //                                                 },
    //                                                 {
    //                                                     text: 'GAL',
    //                                                     fontSize: 10
    //                                                 }
    //                                             ]
    //                                         ]
    //                                     },
    //                                     layout: 'noBorders'
    //                                 }
    //                             ]
    //                         },
    //                         ''
    //                    ],
    //                ]
    //             }
    //         },
    //         {
    //             text : '\n',
    //         },
    //         {
    //             table: {
    //                 headerRows:1,
    //                 widths: [20,160,25,120,120],
    //                 body: [
    //                     [
    //                         'HM',
    //                         {
    //                             text: 'Shipping Description Explosive Materials',
    //                             alignment: 'center'
    //                         },
    //                         {text : [{
    //                             text : 'Pkg Type',
    //                             fontSize : 8}]
    //                         },
    //                         {stack: [
    //                                 'Shipped',
    //                                 {
    //                                     table: {
    //                                         widths: [40,40,40],
    //                                         body: [
    //                                             [{
    //                                                 text:'No Pkgs',
    //                                                 fontSize: 8
    //                                              },{
    //                                                 text:'Units',
    //                                                 fontSize: 8
    //                                              }, '']
    //                                         ]
    //                                     },
    //                                     layout: 'noBorders'
    //                                 }
    //                             ]
    //                         },
    //                         {stack: [
    //                                 'Returned',
    //                                 {
    //                                     table: {
    //                                         widths: [40,40,40],
    //                                         body: [
    //                                             [{
    //                                                 text:'No Pkgs',
    //                                                 fontSize: 8
    //                                              },{
    //                                                 text:'Units',
    //                                                 fontSize: 8
    //                                              }, '']
    //                                         ]
    //                                     },
    //                                     layout: 'noBorders'
    //                                 }
    //                             ]
    //                         },
    //                     ],
    //                     [
    //                         'X',
    //                         {stack: [
    //                                 {
    //                                     table: {
    //                                         body: [
    //                                             [
    //                                                 {
    //                                                     text:'UN2790',
    //                                                     fontSize: 8
    //                                                 }, 
    //                                                 {
    //                                                     text:'Acedic Acid Solution',
    //                                                     fontSize: 8
    //                                                 },
    //                                                 {
    //                                                     text: '8 PGII',
    //                                                     fontSize: 8
    //                                                 }
    //                                             ]
    //                                         ]
    //                                     },
    //                                     layout: 'noBorders'
    //                                 },
    //                                 {
    //                                     table: {
    //                                         body: [
    //                                             [
    //                                                 {
    //                                                     text:'14DE17El',
    //                                                     fontSize: 8,
    //                                                 }, 
    //                                                 {
    //                                                     text:'Orange Cap DC',
    //                                                     fontSize: 8,
    //                                                 },
    //                                                 {
    //                                                     text: '1',
    //                                                     fontSize: 8,
    //                                                 }
    //                                             ]
    //                                         ]
    //                                     },
    //                                     layout: 'noBorders'
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             text : 'Tank',
    //                             fontSize: 10
    //                         },
    //                         {stack: [
    //                                 {
    //                                     table: {
    //                                         widths: [40,40,40],
    //                                         body: [
    //                                             [
    //                                                 {
    //                                                     text:1,
    //                                                     fontSize: 10
    //                                                 }, 
    //                                                 {
    //                                                     text:80,
    //                                                     fontSize: 10
    //                                                 },
    //                                                 {
    //                                                     text: 'GAL',
    //                                                     fontSize: 10
    //                                                 }
    //                                             ]
    //                                         ]
    //                                     },
    //                                     layout: 'noBorders'
    //                                 }
    //                             ]
    //                         },
    //                         ''
    //                    ],
    //                ]
    //             }
    //         }
    //     ]
        
    //}
    // createPdfBinary(dd, function(binary) {
    //     res.contentType('application/pdf');
    //     sendJsonResponse(res,200,binary);
    // }, function(error) {
    //     sendJsonResponse(res,400,error);
    // });
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