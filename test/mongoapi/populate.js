var getDb= require('../../app/db/mongodb/getDb');
var fs= require('fs');
var path= require('path');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing mongoapi.populate',function () {

	before(function (done) {
		fs.writeFileSync(path.resolve('./api/models/User.js'),'module.exports={attributes:{properties:{name:{type:\'string\'}}},reference:{pet:{model:\'Pet\'},belt:{model:\'Belt\'},bag:{model:\'Bag\',multi:true}}}','utf8');	
		fs.writeFileSync(path.resolve('./api/models/Pet.js'),'module.exports={attributes:{properties:{title:{type:\'string\'},species:{type:\'string\'}}},toJSON:function(val){delete val.species; return val;}}','utf8');	
		fs.writeFileSync(path.resolve('./api/models/Belt.js'),'module.exports={attributes:{properties:{type:{type:\'string\'}}}}','utf8');	
		fs.writeFileSync(path.resolve('./api/models/Bag.js'),'module.exports={attributes:{properties:{name:{type:\'string\'}}},toJSON:x=>{delete x.createdAt; delete x.updatedAt; return x;}}','utf8');	
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

	it('Should populate the created document',function (done) {
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
			return Api.User.populate(users);
		})
		.then(function (users) {
			expect(users).to.have.length(2);
			expect(users[0]).to.have.property('pet');
			expect(users[0].pet).to.have.property('title','Dog');
			expect(users[0]).to.have.property('belt');
			expect(users[0].belt).to.have.property('type','Leather');
			

			expect(users[1]).to.have.property('pet');
			expect(users[1].pet).to.have.property('title','Dog');
			expect(users[1]).to.have.property('belt');
			expect(users[1].belt).to.have.property('type','Rexine');

			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	it('Should populate the created document for multi association',function (done) {
		clearRequire.all();
		var Api=require('../../app/db/mongodb')();
		// console.log(Api);

		Promise.all([
			Api.Bag.create({name:'My Gold Bag'}),
			Api.Bag.create({name:'My Silver Bag'})
		])
		.then(function (res) {
			return Api.User.create(
				{name:'Adam',bag:res.map(x=>x.id)},
			);
		})
		.then(function (user) {
			return Api.User.populate(user,['bag'],{toJSON:true});
		})
		.then(function (user) {
			expect(user).to.have.property('bag').to.have.length(2);
			expect(user.bag[0]).to.have.property('name').to.be.equal('My Gold Bag');
			expect(user.bag[1]).to.have.property('name').to.be.equal('My Silver Bag');
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	it('Should populate the created array of documents for multi association',function (done) {
		clearRequire.all();
		var Api=require('../../app/db/mongodb')();
		// console.log(Api);

		Promise.all([
			Api.Bag.create({name:'My Gold Bag'}),
			Api.Bag.create({name:'My Silver Bag'})
		])
		.then(function (res) {
			return Api.User.create(
				[
					{name:'Adam',bag:res.map(x=>x.id)},
					{name:'Eve',bag:res.map(x=>x.id)}
				]
			);
		})
		.then(function (users) {
			return Api.User.populate(users,['bag'],{toJSON:true});
		})
		.then(function (users) {
			
			expect(users).to.have.length(2);
			expect(users[0]).to.have.property('bag');
			expect(users[0].bag[0]).to.have.property('name').to.be.equal('My Gold Bag');
			expect(users[0].bag[1]).to.have.property('name').to.be.equal('My Silver Bag');
			expect(users[1]).to.have.property('bag');
			expect(users[1].bag[0]).to.have.property('name').to.be.equal('My Gold Bag');
			expect(users[1].bag[1]).to.have.property('name').to.be.equal('My Silver Bag');
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	it('Should work with filter passed as an array',function (done) {
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
			return Api.User.populate(users,['pet']);
		})
		.then(function (users) {
			expect(users).to.have.length(2);
			expect(users[0]).to.have.property('pet');
			expect(users[0].pet).to.have.property('title','Dog');
			expect(users[0]).to.have.property('belt');
			expect(typeof users[0].belt).to.equal('string');
			

			expect(users[1]).to.have.property('pet');
			expect(users[1].pet).to.have.property('title','Dog');
			expect(users[1]).to.have.property('belt');
			expect(typeof users[1].belt).to.equal('string');

			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});


	it('Should use options for static functions like toJSON',function (done) {
		clearRequire.all();
		var Api=require('../../app/db/mongodb')();
		// console.log(Api);

		Promise.all([
			Api.Pet.create({title:'Dog',species:'Doge'}),
		])
		.then(function (res) {
			return Api.User.create(
				{name:'Adam',pet:res[0].id},
			);
		})
		.then(function (users) {
			return Api.User.populate(users,null,{toJSON:true});
		})
		.then(function (users) {
			expect(users).to.have.property('pet');
			expect(users.pet).to.have.property('title','Dog');
			expect(users.pet).to.not.have.property('species');
			
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});
})