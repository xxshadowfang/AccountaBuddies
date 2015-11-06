var Sails = require('sails'), sails;

before(function(done) {
	// let the server lift before mocha runs
	this.timeout(5000);
	
	console.log('lifting server...')	
	Sails.lift({
		// configure for testing
		log: {
			level: 'error'
		},
		models: {
			migrate: 'drop'
		}
	}, function(err, server) {
		if (err) return done(err);
		sails = server;
		
		sails.globals = sails.globals || {};
		sails.globals.test = sails.globals.test || {};
		sails.globals.test.request = require('supertest');
		
		// load fixtures??
		done(err, sails);
	});
});

after(function(done) {
	// clear fixtures??
	console.log('shutting down server...')
	Sails.lower(done);
});