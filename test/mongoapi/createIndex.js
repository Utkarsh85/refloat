var getDb= require('../../app/db/mongodb/getDb');
var fs= require('fs');
var path= require('path');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing mongoapi.createIndex',function () {

	before(function (done) {
		fs.writeFileSync(path.resolve('./api/models/User.js'),'module.exports={attributes:{properties:{name:{type:\'string\'}}}, index:[{key:{name:1},unique:true,sparse:true}] }','utf8');	
		done();
	});

	after(function (done) {
		fs.unlinkSync(path.resolve('./api/models/User.js'));

		getDb()
		.then(function (db) {
			return db.collection('user').dropIndexes();
		})
		.then(function () {
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	beforeEach(function (done) {
		getDb()
		.then(function (db) {
			return db.collection('user').dropIndexes();
		})
		.then(function () {
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should create the indexes',function (done) {
		clearRequire.all();
		var createIndex= require('../../app/db/mongodb/createIndex');

		getDb()
		.then(function (db) {
			return Promise.all([db,createIndex()]);
		})
		.then(function (db) {
			return db[0].collection('user').indexes();
		})
		.then(function (indexes) {
			expect(indexes).to.have.length(2);
			expect(indexes[1]).to.have.property('key').to.have.property('name',1);
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});
})