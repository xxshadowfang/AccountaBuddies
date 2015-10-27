var request = require('supertest');

describe('UserController', function() {
	
	describe('login tests', function() {
		it('should return an okay status for login', function(done) {
			console.log("user controller tests");
			request(sails.hooks.http.app)
				.post('/user/register')
				.send({ username: 'collin', password: 'test'})
				.expect(200, done);
				// TODO: write real tests
				//done();
		});
	});
});