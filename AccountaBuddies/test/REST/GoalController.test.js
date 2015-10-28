describe('GoalController', function() {
	var user;
	
	before(function(done) {
		var request = sails.globals.test.request;
		
		user = request.agent(sails.hooks.http.app);
		user.post('/user/register').send({
			username : 'collin',
			password : 'test'
		}).expect(200, done);
	});

	describe('Goal posting tests', function() {
		it('should return an okay status for post goal', function(done) {
			user.post('/goal/create').send({
				name : 'First Goal',
				description : 'This is the description'
			})
			.expect(200, {
				success : true,
				body : {
					content : {
						id : 1
					}
				}
			} ,done);
		});
	});
});