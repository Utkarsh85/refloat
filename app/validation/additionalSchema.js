module.exports=function (ajv,validationConfig) {

	if(validationConfig && typeof(validationConfig) ==="object")
	{
		if(validationConfig.hasOwnProperty('keywords'))
		{
			for( var keyword in validationConfig.keywords)
			{
				ajv.addKeyword(keyword,validationConfig.keywords[keyword]);
			}
		}

		if(validationConfig.hasOwnProperty('formats'))
		{
			for( var format in validationConfig.formats)
			{
				ajv.addFormat(format,validationConfig.formats[format]);
			}
		}
	}

	return ajv;
}