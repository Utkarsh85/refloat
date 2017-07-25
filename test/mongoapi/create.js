var getDb= require('../../app/db/mongodb/getDb');
var fs= require('fs');
var path= require('path');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

var input={model:{filename:'User',modelName:'user',schema:{attributes:{properties:{name:{type:'string'}}}}}};

describe('Testing mongoapi.create',function () {

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
	});

	it('Should create the documents',function (done) {
		var create=require('../../app/db/mongodb/api/create');

		getDb()
		.then(function (db) {
			var newmodel=create(input);
			// console.log(newmodel);
			return Promise.all([db,newmodel.model.create({name:'Hello'})]);
		})
		.then(function (db) {
			return db[0].collection('user').find().toArray();
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

	it('Should create the document with preset id',function (done) {
		var create=require('../../app/db/mongodb/api/create');

		getDb()
		.then(function (db) {
			var newmodel=create(input);
			// console.log(newmodel);
			return Promise.all([db,newmodel.model.create({name:'Hello',id:1})]);
		})
		.then(function (db) {
			return db[0].collection('user').find().toArray();
		})
		.then(function (users) {
			expect(users).to.have.length(1);
			expect(users[0]).to.have.property('name','Hello');
			expect(users[0]).to.have.property('_id',1);
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should create multiple documents',function (done) {
		var create=require('../../app/db/mongodb/api/create');

		getDb()
		.then(function (db) {
			var newmodel=create(input);
			// console.log(newmodel);
			return Promise.all([db,newmodel.model.create([{name:'one'},{name:'two'}])]);
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

	it('Should not return _id instead should return id',function (done) {
		var create=require('../../app/db/mongodb/api/create');

		getDb()
		.then(function (db) {
			var newmodel=create(input);
			// console.log(newmodel);
			return newmodel.model.create({name:'Hello'});
		})
		.then(function (user) {
			expect(user).to.have.property('name','Hello');
			expect(user).to.have.property('id');
			expect(user).to.not.have.property('_id');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});
})