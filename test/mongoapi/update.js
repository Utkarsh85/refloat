var getDb= require('../../app/db/mongodb/getDb');
var fs= require('fs');
var path= require('path');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

var input={model:{filename:'User',modelName:'user',schema:{attributes:{properties:{name:{type:'string'}}}}}};

describe('Testing mongoapi.update',function () {

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

	it('Should update the document',function (done) {
		var update=require('../../app/db/mongodb/api/update');

		getDb()
		.then(function (db) {
			// console.log(newmodel);
			return db.collection('user').insert({name:'hello'});
		})
		.then(function (res) {
			var newmodel=update(input);
			return newmodel.model.update(res.ops[0]._id,{name:'Hello'});
		})
		.then(function (user) {
			expect(user).to.have.property('name','Hello');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should return id instead of _id',function (done) {
		var update=require('../../app/db/mongodb/api/update');

		getDb()
		.then(function (db) {
			// console.log(newmodel);
			return db.collection('user').insert({name:'hello'});
		})
		.then(function (res) {
			var newmodel=update(input);
			return newmodel.model.update(res.ops[0]._id,{name:'Hello'});
		})
		.then(function (user) {
			expect(user).to.have.property('id');
			expect(user).to.not.have.property('_id');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should not be able to update the id',function (done) {
		var update=require('../../app/db/mongodb/api/update');
		var id;
		getDb()
		.then(function (db) {
			return db.collection('user').insert({name:'hello'});
		})
		.then(function (res) {
			id= res.ops[0]._id.toString();
			var newmodel=update(input);
			return newmodel.model.update(res.ops[0]._id,{id:2,name:'Hello'});
		})
		.then(function (user) {
			expect(user).to.have.property('id').to.equal(id);
			expect(user).to.not.have.property('_id');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should update the reference by their ids',function (done) {
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
			return Api.User.update({pet:users[0].pet},{name:'Eve'});
		})
		.then(function (user) {
			expect(user).to.have.property('name','Eve');
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});
})