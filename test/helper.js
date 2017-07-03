var mkdirp = require('mkdirp');
var path= require('path');

// setup
before(function(done) {
    // Increase the Mocha timeout so that Sails has enough time to lift.
    this.timeout(5000);
    mkdirp(path.resolve('./api/controllers'), function (err) {
        if (err) console.error(err)
        else
        {
            mkdirp(path.resolve('./api/models'), function (err) {
                if (err) console.error(err)
                else
                {
                    mkdirp(path.resolve('./config'), function (err) {
                        if (err) console.error(err)
                        else
                        {
                            done();
                        }
                    });
                }
            });
        }
    });
});

// teardown
// after(function (done) {
// });