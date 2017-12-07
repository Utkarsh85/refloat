var flatten= require('flat');

module.exports= function (schema) {
	var collectObj={};

	var flattenedAttributes= flatten(schema.attributes);

	for ( var key in flattenedAttributes)
	{
		if(flattenedAttributes[key] === 'Date')
		{
			var keyList= key.split('.');

			if(keyList[keyList.length -1] === 'instanceof')
			{
				collectObj[keyList[keyList.length -2]] = true;
			}
		}

		if(flattenedAttributes[key] === 'date-time')
		{
			var keyList= key.split('.');

			if(keyList[keyList.length -1] === 'format')
			{
				collectObj[keyList[keyList.length -2]] = true;
			}
		}
	}

	return collectObj;
}