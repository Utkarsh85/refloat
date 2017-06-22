var getDb= require('../../app/db/mongodb/getDb');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing mongocore.find',function () {

	beforeEach(function (done) {
		getDb()
		.then(function (db) {
			return db.collection('user').deleteMany({});
		})
		.then(function (users) {
			// console.log(users);
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	})

	it('Should not throw errors on require',function (done) {
		expect(()=>{require('../../app/db/mongodb/core/find')}).to.not.throw(Error);
		done();
	});

	it('Should find the created document',function (done) {
		var find=require('../../app/db/mongodb/core/find');

		getDb()
		.then(function (db) {
			return Promise.all([db,db.collection('user').insert({name:'Hello'})]);
		})
		.then(function (db) {
			// console.log(db[1]);
			return find(db[0],'user',{},{}).toArray();
		})
		.then(function (users) {
			expect(users).to.have.length(1);
			expect(users[0]).to.have.property('name','Hello');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should work with projection param',function (done) {
		var find=require('../../app/db/mongodb/core/find');

		getDb()
		.then(function (db) {
			return Promise.all([db,db.collection('user').insert({name:'World',password:'secret'})]);
		})
		.then(function (db) {
			// console.log(db[1]);
			return find(db[0],'user',{},{password:0}).toArray();
		})
		.then(function (users) {
			expect(users).to.have.length(1);
			expect(users[0]).to.have.property('name','World');
			expect(users[0]).to.not.have.property('password');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should return [] when no documents exist',function (done) {
		var find=require('../../app/db/mongodb/core/find');

		getDb()
		.then(function (db) {
			// console.log(db[1]);
			return find(db,'user',{},{}).toArray();
		})
		.then(function (users) {
			expect(users).to.have.length(0);
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});
})