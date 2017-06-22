var clearRequire = require('clear-require');
var expect= require('chai').expect;
var ObjectID = require('mongodb').ObjectID;

describe('Testing _id2id library',function () {

	it('Should return id in place of _id',function (done) {
		var _id2id=require('../../app/db/mongodb/utils/_id2id');
		var _id2idFunc=_id2id({schema:{reference: {user:{model:'User'}}}});
		var obj= _id2idFunc({_id:new ObjectID('507f1f77bcf86cd799439011'),password:0});
		expect(obj).to.have.property('id','507f1f77bcf86cd799439011');
		expect(obj).to.have.property('password',0);
		done();
	});

	it('Should work with references too',function (done) {
		var _id2id=require('../../app/db/mongodb/utils/_id2id');
		var _id2idFunc=_id2id({schema:{reference: {user:{model:'User'}}}});
		var obj= _id2idFunc({_id:new ObjectID('507f1f77bcf86cd799439011'),user:ObjectID('507f1f77bcf86cd799439011'),password:ObjectID('507f1f77bcf86cd799439011')});
		expect(obj).to.have.property('id','507f1f77bcf86cd799439011');
		expect(obj).to.have.property('user','507f1f77bcf86cd799439011');
		expect(obj).to.have.property('password');
		expect(obj.password.toHexString()).to.equal('507f1f77bcf86cd799439011');
		done();
	});

	it('Should work when obj is null',function (done) {
		var _id2id=require('../../app/db/mongodb/utils/_id2id');
		var _id2idFunc=_id2id({schema:{reference: {user:{model:'User'}}}});
		var obj= _id2idFunc(null);
		expect(obj).to.equal(null);
		done();
	});

	it('Should work for arrays too',function (done) {
		var _id2id=require('../../app/db/mongodb/utils/_id2id');
		var _id2idFunc=_id2id({schema:{reference: {user:{model:'User'}}}});
		var obj= _id2idFunc([{_id:new ObjectID('507f1f77bcf86cd799439011'),password:0},{_id:new ObjectID('507f1f77bcf86cd799439011'),password:0}]);
		expect(obj[0]).to.have.property('id','507f1f77bcf86cd799439011');
		expect(obj[0]).to.have.property('password',0);
		expect(obj[1]).to.have.property('id','507f1f77bcf86cd799439011');
		expect(obj[1]).to.have.property('password',0);
		done();
	});
});