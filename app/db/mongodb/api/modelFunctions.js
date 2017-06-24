module.exports= function (input) {
	var model= input.model;
	
	Object.keys(model.schema)
	.filter(function (schemaKeys) {
		if(typeof(model.schema[schemaKeys]) === "function")
			return true;
	})
	.forEach(function (schemaKeys) {
		input.model[schemaKeys]=model.schema[schemaKeys];
	});

	return input;
}