var expect = require('chai').expect;

describe('GoalController Integration Tests', function() {
	var user;
	
	before(function(done) {
		var request = sails.globals.test.request;
		
		user = request.agent(sails.hooks.http.app);
		user.post('/user/login').send({
			username : 'collin',
			password : 'test'
		}).expect(200, done);
	});

	describe('Goal posting tests', function() {
		it('should allow user to post goal with 1 step', function(done) {
			user.post('/goal/create').send({
				name : 'First Goal',
				description : 'This is the description',
				steps: [
					{
						title: "first step",
						description: "descript"
					}
				]
			})
			.expect(200, {
				success : true,
				body : {
					content : {
						id : 1
					}
				}
			}, done);
		});
		
		it('should allow user to post goal 1 step', function(done) {
			user.post('/goal/create').send({
				name : 'goal name for 5 steps',
				description : 'goal descript',
				steps: [
					{
						title: "2-first step",
						description: "descript"
					},
					{
						title: "2-second step",
						description: "descripti"
					},
					{
						title: "2-third step",
						description: "descriptio"
					},
					{
						title: "2-fourth step",
						description: "description"
					},
					{
						title: "2-fifth step",
						description: "description!"
					}
				]
			})
			.expect(200, {
				success : true,
				body : {
					content : {
						id : 2
					}
				}
			}, done);
		});
		
		it('should deny goal for undefined name', function(done) {
			user.post('/goal/create').send({
				description : 'This is the description',
				steps: [
						{
							title: "first step",
							description: "descript"
						}
					]
			})
			.expect(200, {
				success : false,
				content: 'You must provide a name'
			}, done);
		});
		
		it('should deny goal for undefined steps', function(done) {
			user.post('/goal/create').send({
				name : 'First Goal',
				description : 'This is the description'
			})
			.expect(200, {
				success : false,
				content: 'You must provide step(s)'
			}, done);
		});
		
		it('should deny goal for non-array of steps', function(done) {
			user.post('/goal/create').send({
				name : 'First Goal',
				description : 'This is the description',
				steps: {
					title: 'first step',
					description: 'descript'
				}
			})
			.expect(200, {
				success : false,
				content: 'You must send in an array of steps'
			}, done);
		});
		
		it('should deny goal for undefined description', function(done) {
			user.post('/goal/create').send({
				name : 'First Goal',
				steps: [
						{
							title: "first step",
							description: "descript"
						}
					]
			})
			.expect(200, {
				success : false,
				content: 'You must provide a description'
			}, done);
		});
		
		it('should deny goal for logged out user', function(done) {
			user.post('/user/logout').send({})
			.expect(200, {
				success: true,
				body: {
					content: ''
				}
			})
			.end(function() {
				user.post('/goal/create').send({
				name : 'First Goal',
				description: 'Description',
				steps: [
						{
							title: "first step",
							description: "descript"
						}
					]
				})
				.expect(200, {
					success : false,
					content: 'You must be logged in to do this'
				})
				.end(function() {
					user.post('/user/login').send({
						username: 'collin',
						password: 'test'
					})
					.expect(200, done);
				});
			});
		});
	});
	
	describe('Reading goals', function() {
		it('should recognize goal 1 has 1 step', function(done) {
			user.get("/goal/find?id=1")
			.send()
			.expect(200)
			.end(function(err, results) {
				if (err) return done(err);
				var goal = results.res.body.body.content;
				
				expect(goal.name).to.be.a('string');
				expect(goal.id).to.equal('1');
				expect(goal.numSteps).to.equal('1');
				expect(goal.steps.length).to.equal(1);
				
				done();
			});
		});
		
		it('should recognize goal 2 has 5 steps', function(done) {
			user.get("/goal/find?id=2")
			.send()
			.expect(200)
			.end(function(err, results) {
				if (err) return done(err);
				var goal = results.res.body.body.content;
				
				expect(goal.name).to.be.a('string');
				expect(goal.id).to.equal('2');
				expect(goal.numSteps).to.equal('5');
				expect(goal.steps.length).to.equal(5);
				
				done();
			});
		});
		
		it('should list goals for user with id 1', function(done) {
			user.get('/goal/list')
			.send()
			.expect(200)
			.end(function(err, results) {
				if (err) return done(err);
				var goals = results.res.body.body.content;
				
				expect(goals.length).to.equal(2);
				expect(goals[0].id).to.equal(1);
				expect(goals[1].id).to.equal(2);
				
				done();
			});
		});
		
		it('should list no goals for user with id 2', function(done) {
			user.post('/user/logout').send({})
			.expect(200)
			.end(function(err, results) {
				if (err) return done(err);
				
				user.post('/user/login').send({
					username: 'collin2',
					password: 'test'
				})
				.expect(200)
				.end(function(err, results) {					
					user.get('/goal/list')
					.send()
					.expect(200, {
						success: true,
						body: {
							content: []
						}
					})
					.end(function(err, results) {
						if (err) return done(err);
						
						user.post('/user/login').send({
							username: 'collin',
							password: 'test'
						})
						.expect(200, done);
					})
				});
			});
		});
	});
	
	describe('Adding and Removing Steps from Goals', function() {
		it('should allow step to be added to a goal', function(done) {
			user.post('/goal/addStep').send({
				title: 'Title',
				description: 'Description',
				goalId: '1',
				sequence: '3'
			})
			.expect(200, {
				success: true,
				body: {
					content: {
						id: 7
					}
				}
			}, done);
		});
		
		it('should deny step to be added without title', function(done) {
			user.post('/goal/addStep').send({
				description: 'Description',
				goalId: '1',
				sequence: '3'
			})
			.expect(200, {
				success: false,
				content: 'You must provide a title.'
			}, done);
		});
		
		it('should deny step to be added without description', function(done) {
			user.post('/goal/addStep').send({
				title: 'title',
				goalId: '1',
				sequence: '3'
			})
			.expect(200, {
				success: false,
				content: 'You must provide a description.'
			}, done);
		});
		
		it('should deny step to be added with invalid goal id', function(done) {
			user.post('/goal/addStep').send({
				title: 'title',
				description: 'descript',
				goalId: '4',
				sequence: '3'
			})
			.expect(200, {
				success: false,
				content: 'Goal does not exist.'
			}, done);
		});
		
		it('should deny step to be added without sequence', function(done) {
			user.post('/goal/addStep').send({
				title: 'title',
				description: 'descript',
				goalId: '2'
			})
			.expect(200, {
				success: false,
				content: 'You must provide a sequence.'
			}, done);
		});
		
		it('should deny step to be removed without step id', function(done) {
			user.post('/goal/removeStep').send({
				goalId: 1
			})
			.expect(200, {
				success: false,
				content: 'You must provide a step id.'
			}, done);
		});
		
		it('should deny step to be removed with invalid goal id', function(done) {
			user.post('/goal/removeStep').send({
				id: 1,
				goalId: 4
			})
			.expect(200, {
				success: false,
				content: 'Goal does not exist.'
			}, done);
		});
		
		it('should deny step to be removed with invalid step id', function(done) {
			user.post('/goal/removeStep').send({
				id: 21,
				goalId: 1
			})
			.expect(200, {
				success: false,
				content: 'Step does not exist.'
			}, done);
		});
		
		it('should allow step to be removed', function(done) {
			user.post('/goal/removeStep').send({
				id: 1,
				goalId: 1
			})
			.expect(200, {
				success: true,
				body: {
					content: ''
				}
			}, done);
		});
	});
	
	describe('Deleting Goals', function() {
		it('should deny goal to be deleted with invalid id', function(done) {
			user.post('/goal/delete').send({
				id: 10
			})
			.expect(200, {
				success: false,
				content: 'Goal does not exist.'
			}, done);
		});
		
		it('should deny goal to be deleted with no id', function(done) {
			user.post('/goal/delete').send({})
			.expect(200, {
				success: false,
				content: 'You must provide a goal id.'
			}, done);
		});
		
		it('should allow goal to be deleted', function(done) {
			user.post('/goal/delete').send({
				id: 2
			})
			.expect(200, {
				success: true,
				body: {
					content: ''
				}
			}, done);
		});
		
		it('should deny goal to be deleted if user doesn\'t own goal', function(done) {
			var userId;
			user.post('/user/register').send({
				username : 'newuser',
				password : 'test'
			}).expect(200)
			.end(function() {
				user.post('/goal/delete').send({
					id: 1
				})
				.expect(200, {
					success: false,
					content: 'You must be the owner of this goal for that action.'
				})
				.end(function() {
					user.post('/user/delete').send({
						id: 4
					})
					.expect(200, done);
				});
			});
		});
	});
});