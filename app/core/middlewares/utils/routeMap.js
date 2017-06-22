module.exports= function (method,action) {
	// if(!isNaN(action))
	// 	action= parseFloat(action);

	switch (method) {
		case 'GET':
			if(action)
				return 'findOne';
			else if(typeof(action)==="undefined")
				return "find";
			else
				return action;
			break;
		case 'POST':
			if(typeof(action)==="undefined")
				return "create";
			else
				return action;
			break;
		case 'PUT':
			if(action)
				return 'update';
			else
				return action;
			break;
		case 'DELETE':
			if(action)
				return 'destroy';
			else
				return action;
			break;
		default:
			return action;
			break;
	}
}