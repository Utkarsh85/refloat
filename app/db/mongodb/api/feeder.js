var getDb= require('../getDb');
var uuid= require('uuid');

var _id2id= function (obj) {
	if(obj)
	{
		obj.id=obj._id.toString();
		delete obj._id;
	}
	return obj;
}

var getfile= function (model,id) {
	return getDb()
	.then(db=>db.collection(model).findOne({_id:id}))
	.then(obj=>_id2id(obj));
};

var putFileOne= function (model,id,singleData) {
	return getDb()
	.then(db=>db.collection(model).update({_id:id},{$push:{data:{$each:[singleData],$position:0}}},{upsert:true}))
}

var putfile= function (model,id,fileData) {

	return getDb()
	.then(db=>db.collection(model).update({_id:id},fileData,{upsert:true}));
};

var feeder = function (model,id) {
	this.__model= model;
	this.__id= id;
	this.__promise= Promise.resolve(null);
	this.__limit=20;
}

feeder.modelId = function(model,id) {
	return new feeder(model,id);
};

feeder.prototype.put = function(data) {
	var self= this;
	this.__promise=this.__promise.then(function () {
		// console.log('Getting File\n');
		return getfile(self.__model,self.__id);
	})
	.then(function (fileData) {

		var newFile=null;
		var newfileName= uuid.v4();

		if(!fileData)
			fileData={};
		if(!fileData.hasOwnProperty('data'))
			fileData.data=[];

		if(fileData.data.length>=self.__limit)
		{
			newFile={next:newfileName,data:[data]};
		}
		else
			fileData.data.unshift(data);

		delete fileData._id; //delete _id if it exists
		// fileData= fileData;
		// console.log('Puting File\n');
		if(newFile)
		{
			return putfile(self.__model,self.__id+'_'+newfileName,fileData)
			.then(function () {
				return putfile(self.__model,self.__id,newFile);
			});	
		}
		else
		{
			return putFileOne(self.__model,self.__id,data);
		}
	});

	return this;
};

feeder.prototype.get = function() {
	var self= this;
	this.__promise=this.__promise.then(function () {
		// console.log('Getting File\n');
		return getfile(self.__model,self.__id);
	});

	return this;
};

feeder.prototype.getMore = function(limiting) {
	var self= this;
	limiting= limiting || 0.75;

	this.__promise=this.__promise.then(function (fileData) {
		if(fileData && fileData.hasOwnProperty('next') && fileData.data.length <=limiting*self.__limit)
			return Promise.all([fileData, getfile(self.__model,self.__id+'_'+fileData.next)]);
		else
			return Promise.all([fileData]);
	})
	.then(function (fileDataArr) {
		if(fileDataArr.length==2)
		{
			fileDataArr[1].data= fileDataArr[0].data.concat(fileDataArr[1].data);
			return fileDataArr[1];
		}
		else
			return fileDataArr[0];
	});

	return this;
};


feeder.prototype.limit = function(limit) {
	this.__limit= limit;
	return this;
};

feeder.prototype.exec = function() {
	return this.__promise;
};

module.exports= feeder;