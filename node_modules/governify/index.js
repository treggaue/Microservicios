'use strict'
var request = require('request');
var express = require('express');

var logger = require('winston');
logger.default.transports.console.timestamp = true;

var url = require('url');
var responseTime = require('response-time');

var governify = new Object();

governify.control = function(app, opt){

	//default options.
	var options = {
		datastore : "http://datastore.governify.io/api/v6.1/",
		namespace: "default",
		apiKeyVariable: "apikey",
		defaultPath: "/",
		metrics: [
			{
				term: 'RequestTerm',
				metric: 'Requests',
				calculate: function(actualValue, req, res, callback){
					//asyncronousCalculation
					callback( parseInt(actualValue) + 1 );
				}
			},
			{
				metric: 'AVGResponseTime',
				calculate: function(actualValue, req, res, callback){
					//asyncronousCalculation
					callback( res._headers['x-response-time'] );
				}
			}
		]
	}

	//update good options
	applyOptionsPolicy(options, opt);

	//return middleware function
	try{

		//add middleware for calculate response time
		app.use(responseTime());

		//add middleware for check SLA
		for(var m in options.metrics){
			var metric = options.metrics[m];
			if(metric.term)
				app.use(metric.path, guaranteeIsComplied(options, metric.term, metric.metric, metric.method, metric.calculate));
		}

		//add middleware for update Metrics
		for(var m in options.metrics ){
			var metric = options.metrics[m];
			app.use(metric.path, updateVariable(options, metric.metric, metric.method, metric.calculate));
		}

	}catch(e){

		throw "The app param must be an expressJS or connectJS middleware app." + e;

	}
}

function guaranteeIsComplied(options, term, metric, method, calculate){
	logger.info("Created middleware to control " + term + " term");
	return function(req, res, next){
		if(method.indexOf(req.method) != -1 || method == ""){
			logger.info("Checking if " + term + " is fulfilled...");
			if(!req.query){
				req.query = url.parse(req.url, true).query;
			}
			if(!req.query[options.apiKeyVariable]){
				sendErrorResponse(401, 'Unauthorized! please check the user query param', res);
			}else{
				var propertyUrl = options.datastore + options.namespace +  "agreements/" + req.query[options.apiKeyVariable] + "/guarantees/" + term;
				request(propertyUrl, function(error, response, body){
					if(!error && response.statusCode == 200 ){
						logger.info(body);

						if(body === "true"){
							next();

						}else{
							sendErrorResponse(429, 'Unauthorized! Too many requests.', res);
						}
					}else{
						sendErrorResponse(402, 'Unauthorized! please check your SLA.', res)
					}
				});
			}
		}else{
			next();
		}
	}
}

function updateVariable(options, metric, method, calculate){
	logger.info("Created middleware to update " + metric + " metric");
	return function(req, res, next){
		next();
		if(method.indexOf(req.method) != -1 || method == ""){
			if(!req.query){
				req.query = url.parse(req.url, true).query;
			}
			if(!req.query[options.apiKeyVariable]){
				sendErrorResponse(401, 'Unauthorized! please check the user query param', res);
			}else{
				var propertyUrl = options.datastore + options.namespace + "agreements/" + req.query[options.apiKeyVariable] + "/properties/" + metric;

				request(propertyUrl, function(error, response, body){
					if(!error && response.statusCode == 200 ){
						var property = JSON.parse(body);

						calculate(property.value, req, res, function(value){
							property.value = value + '';
							request.post({url: propertyUrl, body : JSON.stringify(property), headers:{'Content-Type':'application/json'}}, function(error, response, body){
								if(!error){
									logger.info(metric.toUpperCase() + " property has been updated.");
								}else{
									logger.info("Has occurred an error while it tried update " + metric + " property.");
								}
							});
						});

					}else{
						logger.info("No data, please check your SLA.");
					}
				});
			}
		}else{
			next();
		}
	}
}

//add suppot to Connect, modifing returned options
function sendErrorResponse(code, message, res){
	var error = new Object();
	error.code = code;
	error.message = message;
	try{
		res.status(code);
		res.send(JSON.stringify(error, true));
	}catch(err){
		res.statusCode = code;
		res.end(JSON.stringify(error, true));
	}
}

function applyOptionsPolicy(options, opt){

	//modify default options.
	if(opt){
		if(opt.datastore)
			options.datastore = opt.datastore;
		if(opt.namespace)
			options.namespace = opt.namespace;
		if(opt.apiKeyVariable)
			options.apiKeyVariable = opt.apiKeyVariable;
		if(opt.defaultPath)
			options.defaultPath = opt.defaultPath;
		if(opt.customMetrics)
			options.metrics = opt.customMetrics;

		for(var m in options.metrics){
			if(!options.metrics[m].path)
				options.metrics[m].path = options.defaultPath;
			if(!options.metrics[m].method)
				options.metrics[m].method = "";
		}

	}

	//add "/" to end url.
	if(options.datastore[options.datastore.length-1] != "/")
		options.datastore += "/";
	if(options.namespace[options.namespace.length-1] != "/")
		options.namespace += "/";

}

module.exports = governify;
