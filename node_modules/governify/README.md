# Governify-npm

> This is BETA module and may have bugs and don't work correctly.
> It is intended for qualified beta testers only and must not be used in production systems.

The node module to control API using [Governify](http://governify.io) tools. This module is a middleware which you can use on [ExpressJS](http://expressjs.com/es/) or [ConnectJS](https://github.com/senchalabs/connect).

## Intallation
On your application package run next command:

```
$ npm install governify
```

#### Example
To control the api you must use ```governify.control(app, [options])``` see [Options Object](#optionsObject)

```
var governify = require('governify');
var express = require('express');
var app = express();
var port = 9999;

governify.control(app, options = {
	datastore: "http://datastore.governify.io/api/v6.1",
	namespace: "default",
	apiKeyVariable: "apikey",
	defaultPath: "/api",
	customMetrics: [
		{
			method: 'POST,GET',
			term: 'RequestTerm',
			metric: 'Requests',
			calculate: function(currentValue, req, res, callback){
				//asyncronousCalculation
				callback( parseInt(actualValue) + 1 );
			}
		},
		{
			metric: 'AVGResponseTime',
			calculate: function(currentValue, req, res, callback){
				//asyncronousCalculation
				callback( res._headers['x-response-time'] );
			}
		}
	]
});

var birds = [
	{
		"id" : "234h235buh45bhy456",
		"specie" : "Halcon",
		"place" : "Doñana",
		"legDiameter" : 1.0,
		"wingSize" : 10.0,
		"eggs" : 10,
		"hatches" : 2
	}
]
app.get("/api/v1/birds", function(req, res){
	res.send(birds);
	res.end();
});

app.listen(port, function(){
	console.log("App listening on port: ", port);
});
```

**NOTE:** You must do requests with ```?apikey=:key```. For example:
```
curl -X GET http://localhost:9999/api/v1/birds?apikey=proUser1
```

## <a name="optionsObject"></a> Options object


| Field Name | Type          | Description  |
| :--------- | :------------:| :------------|
| **datastore** | `string`| **Optional** This is the endpoint URL where the service that stores and analyzes the agreement is located. **NOTE:** If you want to use our [datastore](http://datastore.governify.io/), you haven't to give value to this field and the module is going to use datastore by default.  |
| **namespace**   | `string`| **Optional** This field can be used to make out two type of agreement or two type of service, e.g. if you have two services named "api1" and "api2" you can store, analyze and check by different namespaces. By default: `"default"` |
| **apiKeyVariable**    | `string` | **Optional** This field defines the name of url param which will be checked and that will contain the key to identify the agreement of current request. By default: `"apikey"`|
| **defaultPath** | `string`| **Optional**  This field defines the default path that is used by middleware for metrics without path field. By default: `"/"` |
| **customMetrics** | `[metricObject](#metricsObject)`| **Optional**  This field defines the middelwares to control term with custom metrics |


## <a name="metricsObject"></a> Metric object

This object defines fileds to create a middleware and to assosiate an agreement term to it.

| Field Name | Type          | Description  |
| :--------- | :------------:| :------------|
| **path** | `string`| **Optional** Path over the middleware is applicated. |
| **method**   | `string`| **Optional** Method over the middleware is applicated. |
| **term**    | `string` | **Optional** Middleware is assosiated to this term, that must be specified on the SLA. |
| **metric** | `string`| **Optional**  The metric that will be update by this middleware. |
| **calculate** | `Function`| **Optional** This is a function that calculates the value of metric. If you need to calculate it asynchronous you must use: callback(value), else you use: return value. |


#### Example

* **Example 1**

```

{
	datastore: "http://datastore.governify.io/api/v6.1",
	namespace: "default",
	apiKeyVariable: "apikey",
	path: "/api",
	customMetrics: [
		{
			path: "/api",
			method: "POST",
			term: 'ResourcesTerm',
			metric: 'Resources',
			calculate: function(currentValue, req, res, callback){
				//asynchronousCalculation
				db.find({}, function(contact){
					callback( contact.lenght );
				});				
			}
		}
	]
}

```

 On this example you must do request with ```?apikey=:key```. For example:

```
curl -X GET http://localhost:9999/api/v1/birds?apikey=proUser1
```

The URL that will be used to check if *"key"* is authorized is:

```
http://datastore.governify.io/api/v6.1/default/agreements/proUser1
```

And `customMetrics` creates a middleware that checks if ResourceTerm is fulfilled and updates the Resources metric with the value that is calculated asynchronously.

* **Example 2**

```

{
	datastore: "http://datastore.governify.io/api/v6.1",
	namespace: "service1",
	apiKeyVariable: "user",
	path: "/api",
	customMetrics: [
		{
			path: "/api",
			method: "POST",
			term: 'RequestTerm',
			metric: 'Requests',
			calculate: function(currentValue, req, res, callback){
				//synchronousCalculation
				return actualValue + 1;			
			}
		}
	]
}

```

 On this example you must do request with ```?user=:key```. For example:

```
curl -X GET http://localhost:9999/api/v1/birds?user=proUser1
```

The URL that will be used to check if *"key"* is authorized is:

```
http://datastore.governify.io/api/v6.1/service1/agreements/proUser1
```

And `customMetrics` creates a middleware that checks if RequestTerm is fulfilled and updates the Requests metric with the value that is calculated synchronously.
