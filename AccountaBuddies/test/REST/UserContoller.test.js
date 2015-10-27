var request = require('supertest');

describe('UserController', function() {

	describe('login tests', function() {
		it('should return an okay status for login', function(done) {
			console.log("user controller tests");
			request(sails.hooks.http.app).post('/user/register').send({
				username : 'collin',
				password : 'test'
			}).expect(300, done);
			// TODO: write real tests
			// done();
		});
	});
});

afterEach(function() {
	if (this.currentTest.state == 'failed') {
		console.log("we failed!!")
		return -1;
	}
});