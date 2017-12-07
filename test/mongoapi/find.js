var getDb= require('../../app/db/mongodb/getDb');
var fs= require('fs');
var path= require('path');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

var input={model:{filename:'User',modelName:'user',schema:{attributes:{properties:{name:{type:'string'}}}}}};

describe('Testing mongoapi.find',function () {

	before(function (done) {
		fs.writeFileSync(path.resolve('./api/models/User.js'),'module.exports={attributes:{properties:{name:{type:\'string\'},dateField1:{type:"string",format:"date-time"},dateField2:{instanceof:"Date"}}},reference:{pet:{model:\'Pet\'},belt:{model:\'Belt\'}}}','utf8');	
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

	it('Should find the created document',function (done) {
		var find=require('../../app/db/mongodb/api/find');

		getDb()
		.then(function (db) {
			return db.collection('user').insert({name:'Hello'})
		})
		.then(function () {
			var newmodel=find(input);
			// console.log(newmodel);
			return newmodel.model.find({name:'Hello'}).toArray();
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

	it('Should sort find multiple created documents',function (done) {
		var find=require('../../app/db/mongodb/api/find');

		getDb()
		.then(function (db) {
			return db.collection('user').insertMany([{name:'Hello',position:1},{name:'Hello',position:2}])
		})
		.then(function () {
			var newmodel=find(input);
			// console.log(newmodel);
			return newmodel.model.find({name:'Hello'}).sort({position:-1}).toArray();
		})
		.then(function (users) {
			expect(users).to.have.length(2);
			expect(users[0]).to.have.property('position',2);
			expect(users[1]).to.have.property('position',1);
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});


	it('Should sort by _id to find multiple created documents',function (done) {
		var find=require('../../app/db/mongodb/api/find');

		getDb()
		.then(function (db) {
			return db.collection('user').insertMany([{name:'Hello',position:1},{name:'Hello',position:2}])
		})
		.then(function () {
			var newmodel=find(input);
			// console.log(newmodel);
			return newmodel.model.find({name:'Hello'}).sort({id:-1}).toArray();
		})
		.then(function (users) {
			expect(users).to.have.length(2);
			expect(users[0]).to.have.property('position',2);
			expect(users[1]).to.have.property('position',1);
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	it('Should limit find multiple created documents',function (done) {
		var find=require('../../app/db/mongodb/api/find');

		getDb()
		.then(function (db) {
			return db.collection('user').insertMany([{name:'Hello',position:1},{name:'Hello',position:2}])
		})
		.then(function () {
			var newmodel=find(input);
			// console.log(newmodel);
			return newmodel.model.find({name:'Hello'}).limit(1).toArray();
		})
		.then(function (users) {
			expect(users).to.have.length(1);
			expect(users[0]).to.have.property('position',1);
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	it('Should skip find multiple created documents',function (done) {
		var find=require('../../app/db/mongodb/api/find');

		getDb()
		.then(function (db) {
			return db.collection('user').insertMany([{name:'Hello',position:1},{name:'Hello',position:2}])
		})
		.then(function () {
			var newmodel=find(input);
			// console.log(newmodel);
			return newmodel.model.find({name:'Hello'}).skip(1).toArray();
		})
		.then(function (users) {
			expect(users).to.have.length(1);
			expect(users[0]).to.have.property('position',2);
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	it('Should count find multiple created documents',function (done) {
		var find=require('../../app/db/mongodb/api/find');

		getDb()
		.then(function (db) {
			return db.collection('user').insertMany([{name:'Hello',position:1},{name:'Hello',position:2}])
		})
		.then(function () {
			var newmodel=find(input);
			// console.log(newmodel);
			return newmodel.model.find({name:'Hello'}).count();
		})
		.then(function (users) {
			expect(users).to.equal(2);
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	it('Should work with projection param',function (done) {
		var find=require('../../app/db/mongodb/api/find');

		getDb()
		.then(function (db) {
			return db.collection('user').insert({name:'Hello',password:'secret'})
		})
		.then(function () {
			var newmodel=find(input);
			return newmodel.model.find({name:'Hello'},{password:0}).toArray();
		})
		.then(function (users) {
			expect(users).to.have.length(1);
			expect(users[0]).to.have.property('name','Hello');
			expect(users[0]).to.not.have.property('password');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should return null when no documents exist',function (done) {
		var find=require('../../app/db/mongodb/api/find');

		var newmodel=find(input);
        newmodel.model.find({name:'Hello'},{password:0}).toArray()
		.then(function (users) {
			expect(users).to.have.length(0);
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	it('Should return id instead of _id with id to be of type string',function (done) {
		var find=require('../../app/db/mongodb/api/find');

		getDb()
		.then(function (db) {
			return db.collection('user').insert({name:'Hello'})
		})
		.then(function () {
			var newmodel=find(input);
			// console.log(newmodel);
			return newmodel.model.find({name:'Hello'}).toArray();
		})
		.then(function (users) {
			expect(users).to.have.length(1);
			expect(users[0]).to.have.property('id');
			expect(typeof(users[0].id)).to.equal('string');
			expect(users[0]).to.not.have.property('_id');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
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
			return Api.User.find({pet:users[0].pet}).toArray();
		})
		.then(function (users) {
			expect(users).to.have.length(2);
			expect(users[0]).to.have.property('pet');
			expect(users[1]).to.have.property('pet');
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	it('Should find dateFields if queried with string dates',function (done) {
		clearRequire.all();
		var Api=require('../../app/db/mongodb')();

		getDb()
		.then(function (db) {
			return db.collection('user').insert({dateField1:new Date(),dateField2:new Date()})
		})
		.then(function () {
			return Promise.all([
				Api.User.find({dateField1:{$gt:new Date().toISOString()}}).toArray(),
				Api.User.find({dateField1:{$lt:new Date().toISOString()}}).toArray(),
				Api.User.find({dateField1:{$gt:new Date(new Date().getTime() - 50000).toISOString()}}).toArray(),
				Api.User.find({dateField1:{$lt:new Date(new Date().getTime() - 50000).toISOString()}}).toArray(),

				Api.User.find({dateField2:{$gt:new Date().toISOString()}}).toArray(),
				Api.User.find({dateField2:{$lt:new Date().toISOString()}}).toArray(),
				Api.User.find({dateField2:{$gt:new Date(new Date().getTime() - 50000).toISOString()}}).toArray(),
				Api.User.find({dateField2:{$lt:new Date(new Date().getTime() - 50000).toISOString()}}).toArray(),
			])
		})
		.then(function (users) {
			expect(users).to.have.length(8);
			expect(users[0]).to.have.length(0);
			expect(users[1]).to.have.length(1);
			expect(users[2]).to.have.length(1);
			expect(users[3]).to.have.length(0);

			expect(users[4]).to.have.length(0);
			expect(users[5]).to.have.length(1);
			expect(users[6]).to.have.length(1);
			expect(users[7]).to.have.length(0);

			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

})