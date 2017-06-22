module.exports= function (req,res,next) {
	req.Params.id= req.params.id;
	next();
}