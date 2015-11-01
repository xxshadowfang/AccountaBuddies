var Sails = require('sails'), sails;

before(function(done) {
	// let the server lift before mocah runs
	this.timeout(5000);
	
	console.log('lifting server...')	
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
	console.log('shutting down server...')
	Sails.lower(done);
});