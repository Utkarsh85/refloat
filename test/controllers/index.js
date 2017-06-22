var controllers;
var fs= require('fs');
var fse= require('fs-extra');
var mkdirp = require('mkdirp');
var path= require('path');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing controllers library',function () {

	before(function (done) {
		mkdirp(path.resolve('./api/controllers'), function (err) {
		    if (err) console.error(err)
		    else done();
		});
	})

	after(function (done) {
		try
		{
			fs.unlinkSync(path.resolve('./api/controllers/UserController.js'));
		}
		catch(err){ console.log(err) }
		done();
	})

	it('Should return nothing if the api/controllers folder is absent',function (done) {
		fse.removeSync(path.resolve('./api/controllers'));
		fse.mkdirsSync(path.resolve('./api/controllers'));
		clearRequire.all();

		expect(()=>{require('../../app/controllers')}).to.not.throw(Error);
		expect(require('../../app/controllers')).to.be.empty;
		done();
	});

	it('Should return controllers',function (done) {

		fs.writeFileSync(path.resolve('./api/controllers/UserController.js'),'module.exports={find:function(req,res,next){}}','utf8');
		clearRequire.all();
		controllers= require('../../app/controllers');
		expect(controllers).to.have.property('UserController');
		expect(controllers.UserController).to.have.property('find');
		done();
	});
})