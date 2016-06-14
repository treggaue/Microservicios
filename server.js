var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var DataStore = require('nedb');
var governify = require("governify");

var port = (process.env.PORT || 10000);

var app = express();

//governify.control(app,{namespace:'g4', defaultPath:'/ListasVehiculosAPI'});

governify.control(app, options = { namespace: 'g4', apiKeyVariable:'apikey', defaultPath:'/ListasVehiculosAPI',
    customMetrics: [
        {
        	path:"/ListasVehiculosAPI",
            method: "POST,DELETE",
            term: "RequestTerm",
            metric: "Requests",
            calculate: function(currentValue, req, res, callback){
                //asyncronousCalculation
                callback( parseInt(actualValue) + 1 );
            }
        }
       /* {
            method: 'POST',
            term: 'SizeBBDD',
            metric: 'TamBBDD',
            calculate: function(currentValue, req, res, callback){
                //asyncronousCalculation
                callback( path.join(__dirname,'motos.json').length() );
            }
        } */
    ]
});  

//governify.control(app, options = {
//    namespace: "mrg",
//    defaultPath: "/api",
//    customMetrics: [
//        {
//            method: 'POST,GET, DELETE',
//            term: 'RequestTerm',
//            metric: 'Requests',
//            calculate: function(currentValue, req, res, callback){
                //asyncronousCalculation
//                callback( parseInt(actualValue) + 1 );
//            }
//        },
//        {
//            method: 'POST',
//            term: 'SizeBBDD',
//            metric: 'TamBBDD',
//            calculate: function(currentValue, req, res, callback){
//                //asyncronousCalculation
//                callback( path.join(__dirname,'motos.json').length() );
//            }
//        }
//    ]
//});

var dbFileNameCoche  = path.join(__dirname,'coches.json');
var dbFileNameMoto  = path.join(__dirname,'motos.json');
var db1 = new DataStore({
		filename : dbFileNameCoche,
		autoload: true
	});
var db2 = new DataStore({
		filename : dbFileNameMoto,
		autoload: true
	});

console.log('DBs initialized');
console.log('dbFileNameCoche');

db1.find({},function (err,coches){

	if(coches.length == 0){
		console.log('Empty DB, loading initial data');

		coche1 = { 
			marca : 'Mercedes',
			modelo : 'Vito',
			precio : '35.000€'
		};

		coche2 = {
			marca : 'Opel',
			modelo : 'Vivaro',
			precio : '25.000'
		};

		db1.insert([coche1, coche2]);

	}else{
		console.log('DB has '+coches.length+' coches ');
	}

});

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());

app.get('/coches/:index.html',function(req,res){
	console.log('New GET request');

	db1.find({},function (err,coches){
		res.json(coches);
	});
});

app.post('/coches/:index.html',function(req,res){
	console.log('New POST request');
	console.log(req.body);
	db1.insert(req.body);
	res.sendStatus(200);
});

app.get('/coches/:index.html/:modelo',function(req,res){
	var n = req.params.modelo;
	console.log('New GET request for coche with name '+n);

	db1.find({ modelo : n},function (err,coches){
		console.log("Coches obtained: "+coches.length);
		if(coches.length  > 0){
			res.send(coches[0]);
		}else{
			res.sendStatus(404);
		}
	});
});

app.delete('/coches/:index.html/:modelo',function(req,res){
	var n = req.params.modelo;
	console.log('New DELETE request for coche with name '+n);

	db1.remove({ modelo: n},{}, function(err,numRemoved){
		console.log("Coches removed: "+numRemoved);
		if(numRemoved  == 1)
			res.sendStatus(200);
		else
			res.sendStatus(404);
	});
});

db2.find({},function (err,motos){

	if(motos.length == 0){
		console.log('Empty DB, loading initial data');

		moto1 = { 
			marca : 'BMW',
			modelo : '1200GS',
			precio : '15.000€'
		};

		moto2 = {
			marca : 'Honda',
			modelo : 'CBR',
			precio : '10.000'
		};

		db2.insert([moto1, moto2]);

	}else{
		console.log('DB has '+motos.length+' motos ');
	}

});

app.get('/motos/:index.html',function(req,res){
	console.log('New GET request');

	db2.find({},function (err,motos){
		res.json(motos);
	});
});

app.post('/motos/:index.html',function(req,res){
	console.log('New POST request');
	console.log(req.body);
	db2.insert(req.body);
	res.sendStatus(200);
});

app.get('/motos/:index.html/:modelo',function(req,res){
	var n = req.params.modelo;
	console.log('New GET request for moto with name '+n);

	db2.find({ modelo : n},function (err,motos){
		console.log("Motos obtained: "+motos.length);
		if(motos.length  > 0){
			res.send(motos[0]);
		}else{
			res.sendStatus(404);
		}
	});
});

app.delete('/motos/:index.html/:modelo',function(req,res){
	var n = req.params.modelo;
	console.log('New DELETE request for moto with name '+n);

	db2.remove({ modelo: n},{}, function(err,numRemoved){
		console.log("Motos removed: "+numRemoved);
		if(numRemoved  == 1)
			res.sendStatus(200);
		else
			res.sendStatus(404);
	});
});


app.listen(port);
console.log('Magic is happening on port '+port);
