var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe('Get of an unexisting data', function () {
	it('should get a 404', function (){
		request('http://localhost:5000')
		.get('/contacts/xxxx')
		.send()
		.end(function(err,res){
			res.status.should.be.equal(404);
		});
	});
});
