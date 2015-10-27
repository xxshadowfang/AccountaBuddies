var request = require('supertest');

describe('GoalController', function() {
	
	describe('post goal tests', function() {
		it('should return an okay status for post goal', function(done) {
			request(sails.hooks.http.app)
				.post('/user/register')
				//.send({ username: 'collin', password: 'test'})
				//.expect(200, done);
				// TODO: write real tests
				done();
		});
	});
});