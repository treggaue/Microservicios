//Module dependencies
var governify = require('../index.js');
var request = require('request');

//Middelware infractrutures dependecies
var expressApp = require('express')();
var connectApp = require('connect')();

//Test dependencies
var expect = require('chai').expect;
var assert = require('chai').assert;

var port = 8686;

var birds = [{"id" : "234h235buh45bhy456","specie" : "Halcon","place" : "Doñana","legDiameter" : 1.0,"wingSize" : 10.0,"eggs" : 10,"hatches" : 2}]
var server = null;

describe('Express Tests', function() {

  	beforeEach(function() {
    	// runs before each test in this block
    	var app = expressApp;

    	governify.control(app); // add governify middleware.
    	
    	app.get("/api/v1/birds", function(req, res){
			res.send(birds);
			res.end();
		});
    	
    	server = app.listen(port, function(){});

  	});

  	afterEach(function() {
    	// runs after each test in this block
  		server.close();
  	});

  	// test cases
  	describe('UnAuthorized requests', function(){
  		it('#because the request has not key param', function(done){
  			request('http://localhost:'+port+'/api/v1/birds',function(error, response, body){
  				expect(response.statusCode).to.equal(401);
				done();
  			});			
		  });

      it('#because the key has not exist', function(done){
        request('http://localhost:'+port+'/api/v1/birds?apikey=er',function(error, response, body){
          expect(response.statusCode).to.equal(402);
        done();
        });     
      });
	  });
    
  	describe('Authorized requests', function(){
    		it('#Using proUser1', function(done){
    			request('http://localhost:'+port+'/api/v1/birds?apikey=proUser1',function(error, response, body){
    				expect(response.statusCode).to.equal(200);
  				done();
    			});			
  		});
  	});
});


describe('Connect Tests', function() {

    beforeEach(function() {
      // runs before each test in this block
      var app = connectApp;

      governify.control(app); // add governify middleware.
      
      app.use("/api/v1/birds", function(req, res){
        res.end(JSON.stringify(birds));
      });
      
      server = app.listen(port, function(){});

    });

    afterEach(function() {
      // runs after each test in this block
      server.close();
    });

    // test cases
    describe('UnAuthorized requests', function(){
      it('#because the request has not key param', function(done){
        request('http://localhost:'+port+'/api/v1/birds',function(error, response, body){
          expect(response.statusCode).to.equal(401);
          done();
        });     
      });

      it('#because the key has not exist', function(done){
        request('http://localhost:'+port+'/api/v1/birds?apikey=er',function(error, response, body){
          expect(response.statusCode).to.equal(402);
        done();
        });     
      });
    });
    
    describe('Authorized requests', function(){
        it('#Using proUser1', function(done){
          request('http://localhost:'+port+'/api/v1/birds?apikey=proUser1',function(error, response, body){
            expect(response.statusCode).to.equal(200);
            done();
          });     
      });
    });
});