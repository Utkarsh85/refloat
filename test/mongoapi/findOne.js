var getDb= require('../../app/db/mongodb/getDb');
var fs= require('fs');
var path= require('path');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

var input={model:{filename:'User',modelName:'user',schema:{attributes:{properties:{name:{type:'string'}}}}}};

describe('Testing mongoapi.findOne',function () {

	before(function (done) {
		fs.writeFileSync(path.resolve('./api/models/User.js'),'module.exports={attributes:{properties:{name:{type:\'string\'}}},reference:{pet:{model:\'Pet\'},belt:{model:\'Belt\'}}}','utf8');	
		fs.writeFileSync(path.resolve('./api/models/Pet.js'),'module.exports={attributes:{properties:{title:{type:\'string\'}}}}','utf8');	
		fs.writeFileSync(path.resolve('./api/models/Belt.js'),'module.exports={attributes:{properties:{type:{type:\'string\'}}}}','utf8');	
		done();
	});

	after(function (done) {
		fs.unlinkSync(path.resolve('./api/models/User.js'));
		fs.unlinkSync(path.resolve('./api/models/Pet.js'));
		fs.unlinkSync(path.resolve('./api/models/Belt.js'));
		done();
	});

	beforeEach(function (done) {
		getDb()
		.then(function (db) {
			return Promise.all([db.collection('user').deleteMany({}),db.collection('pet').deleteMany({}),db.collection('belt').deleteMany({})]);
		})
		.then(function () {
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should findOne the created document',function (done) {
		var findOne=require('../../app/db/mongodb/api/findOne');

		getDb()
		.then(function (db) {
			return db.collection('user').insert({name:'Hello'})
		})
		.then(function () {
			var newmodel=findOne(input);
			// console.log(newmodel);
			return newmodel.model.findOne({name:'Hello'});
		})
		.then(function (user) {
			expect(user).to.have.property('name','Hello');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should work with projection param',function (done) {
		var findOne=require('../../app/db/mongodb/api/findOne');

		getDb()
		.then(function (db) {
			return db.collection('user').insert({name:'Hello',password:'secret'})
		})
		.then(function () {
			var newmodel=findOne(input);
			return newmodel.model.findOne({name:'Hello'},{password:0});
		})
		.then(function (user) {
			expect(user).to.have.property('name','Hello');
			expect(user).to.not.have.property('password');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should return [] when no documents exist',function (done) {
		var findOne=require('../../app/db/mongodb/api/findOne');

		var newmodel=findOne(input);
        newmodel.model.findOne({name:'Hello'},{password:0})
		.then(function (user) {
			expect(user).to.equal(null);
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should return id instead of _id with id to be of type string',function (done) {
		var findOne=require('../../app/db/mongodb/api/findOne');

		getDb()
		.then(function (db) {
			return db.collection('user').insert({name:'Hello'})
		})
		.then(function () {
			var newmodel=findOne(input);
			// console.log(newmodel);
			return newmodel.model.findOne({name:'Hello'});
		})
		.then(function (user) {
			expect(user).to.have.property('id');
			expect(user).to.not.have.property('_id');
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	it('Should find the reference by their ids',function (done) {
		clearRequire.all();
		var Api=require('../../app/db/mongodb')();
		// console.log(Api);

		Promise.all([
			Api.Pet.create({title:'Dog'}),
			Api.Belt.create({type:'Leather'}),
			Api.Belt.create({type:'Rexine'})
		])
		.then(function (res) {
			return Api.User.create([
				{name:'Adam',pet:res[0].id,belt:res[1].id},
				{name:'Adam',pet:res[0].id,belt:res[2].id}
			]);
		})
		.then(function (users) {
			return Api.User.findOne({pet:users[0].pet});
		})
		.then(function (user) {
			expect(user).to.have.property('pet');
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});
})