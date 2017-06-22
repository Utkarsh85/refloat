var getDb= require('../../app/db/mongodb/getDb');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing mongocore.updateOne',function () {

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
		expect(()=>{require('../../app/db/mongodb/core/updateOne')}).to.not.throw(Error);
		done();
	});

	it('Should updateOne document',function (done) {
		var updateOne=require('../../app/db/mongodb/core/updateOne');

		getDb()
		.then(function (db) {
			return Promise.all([db,db.collection('user').insertMany([{name:'one'},{name:'two'}])]);
		})
		.then(function (db) {
			return updateOne(db[0],'user',{name:{$exists:true}},{name:'three'});
		})
		.then(function (users) {
			expect(users).to.have.property('name','three');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});
})