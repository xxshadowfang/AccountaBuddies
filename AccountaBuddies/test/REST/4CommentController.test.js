var expect = require('chai').expect;

describe('CommentController Integration Tests', function() {
	var user;
	
	before(function(done) {
		var request = sails.globals.test.request;
		
		user = request.agent(sails.hooks.http.app);
		user.post('/user/login').send({
			username: 'collin',
			password: 'test'
		}).expect(200, done);
	});
	
	describe('Comment adding tests', function() {
		it('should deny comment without text', function(done) {
			user.post('/comment/create')
			.send({
				goalId: 77,
				rating: 3,
				nsfw: false
			}).expect(200, {
				success: false,
				content: 'You must provide comment text'
			}, done);
		});
		
		it('should deny comment without goalId', function(done) {
			user.post('/comment/create')
			.send({
				text: 'comment text',
				rating: 3,
				nsfw: false
			}).expect(200, {
				success: false,
				content: 'You must provide a goal id'
			}, done);
		});
		
		it('should deny comment with invalid goalId', function(done) {
			user.post('/comment/create')
			.send({
				goalId: 77,
				text: 'comment text',
				rating: 3,
				nsfw: false
			}).expect(200, {
				success: false,
				content: 'Goal does not exist.'
			}, done);
		});
		
		it('should allow comment to be posted', function(done) {
			user.post('/comment/create')
			.send({
				goalId: 1,
				text: 'comment text',
				rating: 3,
				nsfw: false
			}).expect(200, {
				success: true,
				body: {
					content: {
						id: 1
					}
				}
			}, done);
		});
		
		it('should allow comment to be posted with user that doesn\'t own goal', function(done) {
			user.post('/user/logout').send({})
			.end(function(err, res) {
				if (err) return done(err);
				
				user.post('/user/login')
				.send({
					username: 'collin2',
					password: 'test'
				}).expect(200)
				.end(function(err, res) {
					if (err) return done(err);
					
					user.post('/comment/create')
					.send({
						goalId: 1,
						text: 'userId should be 2',
						rating: 5,
						nsfw: true
					}).expect(200, {
						success: true,
						body: {
							content: {
								id: 2
							}
						}
					})
					.end(function(err, res) {
						if (err) return done(err);
						// ensure we have 2 comments
						user.get("/goal/find?id=1")
						.send()
						.expect(200)
						.end(function(err, results) {
							if (err) return done(err);
							var goal = results.res.body.body.content;
							
							expect(goal.comments.length).to.equal(2);
							expect(goal.comments[1].userId).to.equal('2');
							done();
						});
					});
				});
			});
		});
	});
	
	describe('Deleting comments', function() {
		it('Should deny comment from deletion without commentId', function(done) {
			user.post('/comment/delete')
			.send({})
			.expect(200, {
				success: false,
				content: 'You must provide a comment id'
			}, done);
		});
		
		it('Should deny comment from deletion without comment ownership', function(done) {
			user.post('/comment/delete')
			.send({
				id : 1
			})
			.expect(200, {
				success: false,
				content: 'You must be the owner of this comment to delete it.'
			}, done);
		});
		
		it('Should allow comment to be deleted', function(done) {
			user.post('/comment/delete')
			.send({
				id : 2
			})
			.expect(200, {
				success: true,
				body: {
					content: ''
				}
			}, done);
		});
	});
});
