var Sails = require('sails'), sails;

before(function(done) {
	// let the server lift while 
	this.timeout(5000);
	
	Sails.lift({
		// configure for testing
	}, function(err, server) {
		sails = server;
		if (err) return done(err);
		
		// load fixtures??
		done(err, sails);
	});
});

after(function(done) {
	// clear fixtures??
	Sails.lower(done);
});