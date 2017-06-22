var getDb= require('../../app/db/mongodb/getDb');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing mongocore.destroyOne',function () {

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
		expect(()=>{require('../../app/db/mongodb/core/destroyOne')}).to.not.throw(Error);
		done();
	});

	it('Should destroyOne document',function (done) {
		var destroyOne=require('../../app/db/mongodb/core/destroyOne');

		getDb()
		.then(function (db) {
			return Promise.all([db,db.collection('user').insertMany([{name:'one'},{name:'two'}])]);
		})
		.then(function (db) {
			return destroyOne(db[0],'user',{name:{$exists:true}});
		})
		.then(function (user) {
			expect(user).to.have.property('name','one');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});
})