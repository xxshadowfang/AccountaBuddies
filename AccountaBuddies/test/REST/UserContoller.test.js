describe('UserController Integration Tests', function() {
	var user;
	
	before(function(done) {
		var request = sails.globals.test.request;
		
		user = request.agent(sails.hooks.http.app);
		user.post('/user/register').send({
			username : 'collin',
			password : 'test'
		}).expect(200, done);
	});
	
	describe('Login and Logout tests', function() {
		it('should allow user to login', function(done) {
			user.post('/user/login').send({
				username: 'collin',
				password: 'test'
			}).expect(200, {
				success: true,
				body: {
					content: ''
				}
			}, done);
		});
		
		it('should deny login for username that is invalid', function(done) {
			user.post('/user/login').send({
				username: 'co2llin',
				password: 'test'
			}).expect(200, {
				success: false,
				content: 'User was not found.'
			}).end(function(err, res) {
				if (err) return done(err);
				done();
			});
		});
		
		it('should deny login for password that is invalid', function(done) {
			user.post('/user/login').send({
				username: 'collin',
				password: 'Test'
			}).expect(200, {
				success: false,
				content: 'Password did not match.'
			}).end(function(err, res) {
				if (err) return done(err);
				done();
			});
		});
		
		it('should allow user to logout', function(done) {
			user.post('/user/logout').send({})
			.expect(200, {
				success: true,
				body: {
					content: ''
				}
			}).end(function(err, res) {
				if (err) return done(err);
				done();
			});
		});
		
		it('should deny logging out if not logged in', function(done) {
			user.post('/user/logout').send({})
			.expect(200, {
				success: false,
				content: 'You must be logged in to do this'
			}).end(function(err, res) {
				if (err) return done(err);
				done();
			});
		});
	});
	
	describe('Register tests', function() {
		it('should deny user to register without username', function(done) {
			user.post('/user/register').send({
				password: 'test'
			})
			.expect(200, {
				success: false,
				content: 'You must provide a username.'
			})
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
		});
		
		it('should deny user to register without password', function(done) {
			user.post('/user/register').send({
				username: 'test'
			})
			.expect(200, {
				success: false,
				content: 'You must provide a password.'
			})
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
		});
		
		it('should allow user to register', function(done) {
			user.post('/user/register').send({
				username: 'test',
				password: 'test'
			})
			.expect(200, {
				success: true,
				body: {
					content: {
						id: 2
					}
				}
			})
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
		});
	});	
});

//afterEach(function() {
//	if (this.currentTest.state == 'failed') {
//		console.log("we failed!!")
//		return -1;
//	}
//});