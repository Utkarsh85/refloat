var getDb= require('../../app/db/mongodb/getDb');
var fs= require('fs');
var path= require('path');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

var input={model:{filename:'User',modelName:'user',schema:{attributes:{properties:{name:{type:'string'}}}}}};

describe('Testing mongoapi.updateMany',function () {

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

	it('Should updateMany the document',function (done) {
		var updateMany=require('../../app/db/mongodb/api/updateMany');

		getDb()
		.then(function (db) {
			// console.log(newmodel);
			return db.collection('user').insert([{name:'one'},{name:'two'}]);
		})
		.then(function (res) {
			var newmodel=updateMany(input);
			return newmodel.model.updateMany({},{name:'Hello'});
		})
		.then(function (users) {
			expect(users).to.have.length(2);
			expect(users[0]).to.have.property('name','Hello');
			expect(users[1]).to.have.property('name','Hello');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should return id instead of _id',function (done) {
		var updateMany=require('../../app/db/mongodb/api/updateMany');

		getDb()
		.then(function (db) {
			// console.log(newmodel);
			return db.collection('user').insert([{name:'one'},{name:'two'}]);
		})
		.then(function (res) {
			var newmodel=updateMany(input);
			return newmodel.model.updateMany({},{name:'Hello'});
		})
		.then(function (users) {
			expect(users).to.have.length(2);
			expect(users[0]).to.have.property('id');
			expect(users[0]).to.not.have.property('_id');
			expect(users[1]).to.have.property('id');
			expect(users[1]).to.not.have.property('_id');
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	it('Should updateMany the reference by their ids',function (done) {
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
			return Api.User.updateMany({pet:users[0].pet},{name:'Eve'});
		})
		.then(function (users) {
			expect(users).to.have.length(2);
			expect(users[0]).to.have.property('name','Eve');
			expect(users[1]).to.have.property('name','Eve');
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});
})