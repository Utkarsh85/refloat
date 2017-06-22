var getDb= require('../../app/db/mongodb/getDb');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing mongocore.destroy',function () {

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
		expect(()=>{require('../../app/db/mongodb/core/destroy')}).to.not.throw(Error);
		done();
	});

	it('Should destroy document',function (done) {
		var destroy=require('../../app/db/mongodb/core/destroy');

		getDb()
		.then(function (db) {
			return Promise.all([db,db.collection('user').insertMany([{name:'one'},{name:'two'}])]);
		})
		.then(function (db) {
			return destroy(db[0],'user',{name:{$exists:true}});
		})
		.then(function (users) {
			expect(users).to.have.length(2);
			expect(users[0]).to.have.property('name','one');
			expect(users[1]).to.have.property('name','two');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});
})