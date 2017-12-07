var clearRequire = require('clear-require');
var chai= require('chai');
var asserttype = require('chai-asserttype');
chai.use(asserttype);
var expect= chai.expect;
var ObjectID = require('mongodb').ObjectID;

describe('Testing id2_id library',function () {

	it('Should return _id in place of id',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc({id:'507f1f77bcf86cd799439011',password:0});
		expect(obj).to.have.property('_id');
		expect(obj._id.toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(obj).to.have.property('password',0);
		done();
	});

	it('Should return _id in place of id but should be a number if id is a number',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc({id:2,password:0});
		expect(obj).to.have.property('_id');
		expect(obj._id).to.equal(2);
		expect(obj).to.have.property('password',0);
		done();
	});

	it('Should return _id in place of id but should be a string if id is a string',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc({id:'2',password:0});
		expect(obj).to.have.property('_id');
		expect(obj._id).to.equal('2');
		expect(obj).to.have.property('password',0);
		done();
	});

	it('Should return _id in place of id even if _id does exist in the input object',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc({id:'507f1f77bcf86cd799439011',password:0,_id:'hello'});
		expect(obj).to.have.property('_id');
		expect(obj._id.toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(obj).to.have.property('password',0);
		done();
	});

	it('Should work with references too',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc({id:'507f1f77bcf86cd799439011',user:'507f1f77bcf86cd799439011',password:'507f1f77bcf86cd799439011'});
		expect(obj).to.have.property('_id');
		expect(obj._id.toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(obj).to.have.property('user');
		expect(obj.user.toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(obj).to.have.property('password','507f1f77bcf86cd799439011');
		done();
	});

	it('Should work when obj is null',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc(null);
		expect(obj).to.equal(null);
		done();
	});

	it('Should work with array of references too',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc({id:'507f1f77bcf86cd799439011',user:['507f1f77bcf86cd799439011','507f1f77bcf86cd799439012'],password:'507f1f77bcf86cd799439011'});
		expect(obj).to.have.property('_id');
		expect(obj._id.toHexString()).to.equal('507f1f77bcf86cd799439011');

		expect(obj).to.have.property('user').to.have.length(2);
		expect(obj.user[0].toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(obj.user[1].toHexString()).to.equal('507f1f77bcf86cd799439012');

		expect(obj).to.have.property('password','507f1f77bcf86cd799439011');
		done();
	});

	it('Should work for arrays too',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc([{id:'507f1f77bcf86cd799439011',password:0},{id:'507f1f77bcf86cd799439011',password:0}]);
		expect(obj[0]).to.have.property('_id');
		expect(obj[0]._id.toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(obj[0]).to.have.property('password',0);
		expect(obj[1]).to.have.property('_id');
		expect(obj[1]._id.toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(obj[1]).to.have.property('password',0);
		done();
	});

	it('Should return _id in place of id for $in for id',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc({id:{$in:['507f1f77bcf86cd799439011','507f1f77bcf86cd799439012']},password:0});
		expect(obj).to.have.property('_id').to.have.property('$in').to.have.length(2);
		expect(obj['_id']['$in'][0].toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(obj['_id']['$in'][1].toHexString()).to.equal('507f1f77bcf86cd799439012');
		expect(obj).to.have.property('password',0);
		done();
	});

	it('Should return ObjectId for $in for reference',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc({user:{$in:['507f1f77bcf86cd799439011','507f1f77bcf86cd799439012']},password:0});
		expect(obj).to.have.property('user').to.have.property('$in').to.have.length(2);
		expect(obj['user']['$in'][0].toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(obj['user']['$in'][1].toHexString()).to.equal('507f1f77bcf86cd799439012');
		expect(obj).to.have.property('password',0);
		done();
	});

	it('Should not return ObjectId for anything else',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc({username:{$in:['507f1f77bcf86cd799439011','507f1f77bcf86cd799439012']},password:0});
		expect(obj).to.have.property('username').to.have.property('$in').to.have.length(2);
		expect(obj['username']['$in'][0]).to.equal('507f1f77bcf86cd799439011');
		expect(obj['username']['$in'][1]).to.equal('507f1f77bcf86cd799439012');
		expect(obj).to.have.property('password',0);
		done();
	});

	it('Should resolve format date-time and instanceof Date fields to Date Object',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{attributes:{properties:{dateField1:{type:'string',format:'date-time',convertToObject:true},dateField2:{instanceof:'Date',convertToObject:true}}}},dateFields:{dateField1:true,dateField2:true}});
		var obj= id2_idFunc({dateField1:new Date().toISOString(),dateField2:new Date().toISOString()});
		expect(obj.dateField1).to.be.date();
		expect(obj.dateField2).to.be.date();
		done();
	});
});