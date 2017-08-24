var getDb= require('../../app/db/mongodb/getDb');
var fs= require('fs');
var path= require('path');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing mongoapi.feeder',function () {

	beforeEach(function (done) {
		getDb()
		.then(function (db) {
			return db.collection('feed').deleteMany({});
		})
		.then(function () {
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should put a feed to feed collection',function (done) {
		var feeder=require('../../app/db/mongodb/api/feeder');
		var _db;
		
		feeder.modelId('feed','123').put({name:'Hello'}).get().exec()
		.then(function (feed) {
			expect(feed).to.have.property('data').to.have.length(1);
			expect(feed).to.have.property('id');
			expect(feed.data[0]).to.have.property('name','Hello');
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	it('Should put a feed to a new feed collection document once the collection is over',function (done) {
		var feeder=require('../../app/db/mongodb/api/feeder');
		var _db;
		
		feeder.modelId('feed','123').limit(2).put({name:'Hello1'}).put({name:'Hello2'}).put({name:'Hello3'}).get().exec()
		.then(function (feed) {
			expect(feed).to.have.property('data').to.have.length(1);
			expect(feed).to.have.property('id');
			expect(feed).to.have.property('next');
			expect(feed.data[0]).to.have.property('name','Hello3');
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	it('Should getMore a feed',function (done) {
		var feeder=require('../../app/db/mongodb/api/feeder');
		var _db;
		
		feeder.modelId('feed','123').limit(2).put({name:'Hello1'}).put({name:'Hello2'}).put({name:'Hello3'}).get().getMore().exec()
		.then(function (feed) {
			expect(feed).to.have.property('data').to.have.length(3);
			expect(feed).to.have.property('id');
			expect(feed).to.not.have.property('next');
			expect(feed.data[0]).to.have.property('name','Hello3');
			expect(feed.data[1]).to.have.property('name','Hello2');
			expect(feed.data[2]).to.have.property('name','Hello1');
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});
})