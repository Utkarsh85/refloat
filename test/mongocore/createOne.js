var getDb= require('../../app/db/mongodb/getDb');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing mongocore.createOne',function () {

	beforeEach(function (done) {
		getDb()
		.then(function (db) {
			return db.collection('user').deleteMany({});
		})
		.then(function (user) {
			// console.log(user);
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	})

	it('Should not throw errors on require',function (done) {
		expect(()=>{require('../../app/db/mongodb/core/createOne')}).to.not.throw(Error);
		done();
	});

	it('Should createOne document',function (done) {
		var createOne=require('../../app/db/mongodb/core/createOne');

		getDb()
		.then(function (db) {
			return Promise.all([db,createOne(db,'user',{name:'one'})]);
		})
		.then(function (db) {
			return db[0].collection('user').find().toArray();
		})
		.then(function (users) {
			expect(users).to.have.length(1);
			expect(users[0]).to.have.property('name','one');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should throw error on createOne multiple documents by passing an []',function (done) {
		var createOne=require('../../app/db/mongodb/core/createOne');

		getDb()
		.then(function (db) {
			return Promise.all([db,createOne(db,'user',[{name:'one'},{name:'two'}])]);
		})
		.then(function (db) {
			return db[0].collection('user').find().toArray();
		})
		.then(function (users) {
			// expect(users).to.have.length(2);
			// expect(users[0]).to.have.property('name','one');
			// expect(users[1]).to.have.property('name','two');
		})
		.catch(function (err) {
			expect(err).to.not.be.empty;
			done();
		})
	});
})