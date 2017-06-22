var getDb= require('../../app/db/mongodb/getDb');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing mongocore.create',function () {

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
		expect(()=>{require('../../app/db/mongodb/core/create')}).to.not.throw(Error);
		done();
	});

	it('Should create document',function (done) {
		var create=require('../../app/db/mongodb/core/create');

		getDb()
		.then(function (db) {
			return Promise.all([db,create(db,'user',[{name:'one'},{name:'two'}])]);
		})
		.then(function (db) {
			return db[0].collection('user').find().toArray();
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

	it('Should throw error when an object {} is passed for creation',function (done) {
		var create=require('../../app/db/mongodb/core/create');

		getDb()
		.then(function (db) {
			return Promise.all([db,create(db,'user',{})]);
		})
		.then(function (db) {
			return db[0].collection('user').find().toArray();
		})
		.then(function (users) {
		})
		.catch(function (err) {
			expect(err).to.not.be.empty;
			done();
		})
	});

	it('Should throw error when no documents [] are passed for creation',function (done) {
		var create=require('../../app/db/mongodb/core/create');

		getDb()
		.then(function (db) {
			return Promise.all([db,create(db,'user',[])]);
		})
		.then(function (db) {
			return db[0].collection('user').find().toArray();
		})
		.then(function (users) {
		})
		.catch(function (err) {
			expect(err).to.not.be.empty;
			done();
		})
	});
})