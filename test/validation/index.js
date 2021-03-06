var fs= require('fs');
var mkdirp = require('mkdirp');
var path= require('path');
var clearRequire = require('clear-require');
var chai= require('chai');
var asserttype = require('chai-asserttype');
chai.use(asserttype);
var expect= chai.expect;

describe('Testing validation library',function () {

	before(function (done) {
		mkdirp(path.resolve('./config'), function (err) {
		    if (err) console.error(err)
		    else done();
		});
	})

	after(function (done) {
		try
		{
			fs.unlinkSync(path.resolve('./config/validation.js'));
			
		}
		catch(err){ console.log(err) }
		done();
	})

	it('Should not throw an error if no config/validation file found',function (done) {
		expect(()=>{require('../../app/validation')}).to.not.throw(Error);
		done();
	});

	it('Should validate an instance',function (done) {
		var validation=require('../../app/validation');
		var schema={attributes:{properties:{name:{type:'string'}}}};
		var instance={name:'Hello'};

		validation(schema,instance)
		.then(function (instance) {
			// console.log(instance);
			expect(instance).to.have.property('name','Hello');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should reject promise for error in validation',function (done) {
		clearRequire.all();
		var validation=require('../../app/validation');
		var schema={attributes:{properties:{name:{type:'string'}}}};
		var instance={name:2};

		validation(schema,instance)
		.then(function (instance) {
			// console.log(instance);
		})
		.catch(function (err) {
			expect(err).to.not.be.empty;
			done();
			// console.log(err);
		})
	});

	it('Should consider references as strings',function (done) {
		var validation=require('../../app/validation');
		var schema={reference:{user:{model:'User'}},attributes:{properties:{name:{type:'string'}}}};
		var instance={user:'lfkjfnbsnklhkh'};

		validation(schema,instance)
		.then(function (instance) {
			// console.log(instance);
			expect(instance).to.have.property('user','lfkjfnbsnklhkh');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});

	it('Should not consider references as other than strings',function (done) {
		var validation=require('../../app/validation');
		var schema={reference:{user:{model:'User'}},attributes:{properties:{name:{type:'string'}}}};
		var instance={user:6552524};

		validation(schema,instance)
		.then(function (instance) {
			// console.log(instance);
		})
		.catch(function (err) {
			expect(err).to.not.be.empty;
			done();
		})
	});

	it('Should work with the keywords added to the validation config file',function (done) {
		fs.writeFileSync(path.resolve('./config/validation.js'),'module.exports={keywords:{range:{ type: \'number\', compile: function (sch, parentSchema) {\r\n  var min = sch[0];\r\n  var max = sch[1];\r\n\r\n  return parentSchema.exclusiveRange === true\r\n          ? function (data) { return data > min && data < max; }\r\n          : function (data) { return data >= min && data <= max; }\r\n} }}}','utf8');
		clearRequire.all();
		var validation=require('../../app/validation');
		var schema={attributes:{properties:{num:{"range": [2, 4], "exclusiveRange": true}}}};
		var instance={num:22};

		validation(schema,instance)
		.then(function (instance) {
			// console.log(instance);
		})
		.catch(function (err) {
			expect(err).to.not.be.empty;
			done();
		})
	});

	it('Should now convert format date-time and instanceof Date as Date object when convertToObject is true',function (done) {
		var validation=require('../../app/validation');
		var schema={attributes:{properties:{dateField1:{type:'string',format:'date-time',convertToObject:true},dateField2:{instanceof:'Date',convertToObject:true}}}};
		var instance={dateField1:new Date().toISOString(),dateField2:new Date().toISOString()};

		validation(schema,instance)
		.then(function (instance) {
			expect(instance.dateField1).to.be.date();
			expect(instance.dateField2).to.be.date();
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});


	it('Should not put default fields if removeDefaults is true',function (done) {
		fs.writeFileSync(path.resolve('./config/validation.js'),'module.exports={rules:{useDefaults:true}}','utf8');
		clearRequire.all();
		var validation=require('../../app/validation');
		var schema={attributes:{properties:{age:{type:'string',default:'14'},name:{type:'string'}}}};
		var instance1={name:'Boss'};
		var instance2={name:'Boss'};

		Promise.all([
			validation(schema,instance1),
			validation(schema,instance2,true)
		])
		.then(function ([instance1,instance2]) {
			expect(instance1).to.have.property('age','14');
			expect(instance2).to.not.have.property('age');
			done();
		})
		.catch(function (err) {
			console.log(err);
		})
	});
})