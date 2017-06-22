var busboy = require('connect-busboy');
module.exports = [busboy(),
function (req,res,next) {
	if(req.busboy)
	{
	    req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
	      req.body[key]=value;
	    });

	    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		    if (!filename) {
		      // If filename is not truthy it means there's no file
		      return;
		    }
		    // Create the initial array containing the stream's chunks
		    file.fileRead = [];

		    file.on('data', function(chunk) {
		      // Push chunks into the fileRead array
		      this.fileRead.push(chunk);
		    });

		    file.on('error', function(err) {
		      console.log('Error while buffering the stream: ', err);
		    });

		    file.on('end', function() {
		      // Concat the chunks into a Buffer
		      var finalBuffer = Buffer.concat(this.fileRead);
		      if(!req.files)
		      	req.files=[];

		      req.files.push({
		        buffer: finalBuffer,
		        size: finalBuffer.length,
		        filename: filename,
		        mimetype: mimetype
		      });

		    });
		});
	    req.pipe(req.busboy);
	    req.busboy.on('finish', next);
	}
	else
	    next();
}]