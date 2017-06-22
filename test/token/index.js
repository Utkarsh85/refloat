var tokenlib;
var fs= require('fs');
var path= require('path');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing token library',function () {

	after(function (done) {
		fs.unlinkSync(path.resolve('./config/token.js'));
		done();
	})

	it('Should return an error if config/token.js is absent',function (done) {
		expect(()=>{require('../../app/token')}).to.throw(Error);
		done();
	});

	it('Should return an error if config/token.js does not have a secret',function (done) {

		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={}','utf8');
		clearRequire.all();
		expect(()=>{require('../../app/token')}).to.throw(Error);
		done();
	});

	it('Should load fine if config/token.js has a secret',function (done) {
		fs.unlinkSync(path.resolve('./config/token.js'));

		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={secret:\'Hello World\'}','utf8');

		clearRequire.all();
		expect(()=>{require('../../app/token')}).to.not.throw(Error);
		done();
	});

	it('Should create the jwt token',function (done) {
		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={secret:\'Hello World\'}','utf8');
		clearRequire.all();
		tokenlib= require('../../app/token');

		var token=tokenlib.create(1);
		expect(token).to.not.empty;
		expect(token.split('.')).to.have.length(3);
		done();
	})

	it('Should verify jwt token',function (done) {
		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={secret:\'Hello World\'}','utf8');
		clearRequire.all();
		tokenlib= require('../../app/token');

		var tokenVerified=tokenlib.verify(1);
		expect(tokenVerified).to.be.equal(false);

		var token= tokenlib.create(1);
		var tokenVerified=tokenlib.verify(token);
		expect(tokenVerified).to.be.equal(true);

		done();
	})

	it('Should extract payload of jwt token',function (done) {
		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={secret:\'Hello World\'}','utf8');
		clearRequire.all();
		tokenlib= require('../../app/token');

		var token= tokenlib.create(1);

		var payload=tokenlib.payload(token);
		expect(payload).to.have.property('base');
		expect(payload.base).to.be.equal(1);

		done();
	})
})