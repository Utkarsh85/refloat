var models;
var fs= require('fs');
var fse= require('fs-extra');
var mkdirp = require('mkdirp');
var path= require('path');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing models library',function () {

	before(function (done) {
		mkdirp(path.resolve('./api/models'), function (err) {
		    if (err) console.error(err)
		    else done();
		});
	})

	after(function (done) {
		try
		{
			fs.unlinkSync(path.resolve('./api/models/User.js'));
			
		}
		catch(err){ console.log(err) }
		done();
	})

	it('Should return nothing if the api/models folder is absent',function (done) {
		fse.removeSync(path.resolve('./api/models'));
		fse.mkdirsSync(path.resolve('./api/models'));
		clearRequire.all();
		expect(()=>{require('../../app/models')}).to.not.throw(Error);
		expect(require('../../app/models')).to.be.empty;
		done();
	});

	it('Should return models',function (done) {

		fs.writeFileSync(path.resolve('./api/models/User.js'),'module.exports={attributes:{}}','utf8');
		clearRequire.all();
		models= require('../../app/models');
		expect(models).to.have.property('User');
		expect(models.User).to.have.property('modelName','user');
		done();
	});

	it('Should return models with different modelName if collectionName is defined',function (done) {

		fs.writeFileSync(path.resolve('./api/models/User.js'),'module.exports={collectionName:\'hello\',attributes:{}}','utf8');
		clearRequire.all();
		models= require('../../app/models');
		expect(models).to.have.property('User');
		expect(models.User).to.have.property('modelName','hello');
		done();
	});

	it('Should return dateFields if defined',function (done) {

		fs.writeFileSync(path.resolve('./api/models/User.js'),'module.exports={attributes:{dateField1:{type:\'string\',format:\'date-time\'},dateField2:{instanceof:\'Date\'}}}','utf8');
		clearRequire.all();
		models= require('../../app/models');
		expect(models).to.have.property('User');
		expect(models.User).to.have.property('dateFields');
		expect(models.User.dateFields).to.have.property('dateField1');
		expect(models.User.dateFields).to.have.property('dateField2');
		expect(models.User.dateFields).to.have.property('createdAt');
		expect(models.User.dateFields).to.have.property('updatedAt');
		done();
	});
})