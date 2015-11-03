var expect = require('chai').expect;

describe('GroupController Integration Tests', function() {
	var user;
	
	before(function(done) {
		var request = sails.globals.test.request;
		
		user = request.agent(sails.hooks.http.app);
		user.post('/user/login').send({
			username : 'collin',
			password : 'test'
		}).expect(200, done);
	});
	
	describe('Group creation tests', function() {
		it('should deny group creation without a name', function(done) {
			user.post('/group/create')
			.send({
				description: 'group number one',
				motto: 'never ever give up'
			})
			.expect(200, {
				success: false,
				content: 'You must provide a name'
			}, done);
		});
		
		it('should deny group creation without a description', function(done) {
			user.post('/group/create')
			.send({
				name: 'group name',
				motto: 'never ever give up'
			})
			.expect(200, {
				success: false,
				content: 'You must provide a description'
			}, done);
		});
		
		it('should deny group creation without a motto', function(done) {
			user.post('/group/create')
			.send({
				name: 'group name',
				description: 'group number one'
			})
			.expect(200, {
				success: false,
				content: 'You must provide a motto'
			}, done);
		});
		
		it('should allow a group creation', function(done) {
			user.post('/group/create')
			.send({
				name: 'group name',
				description: 'group number one',
				motto: 'never ever give up'
			})
			.expect(200, {
				success: true,
				body: {
					content: {
						id: 1
					}
				}
			}, done);
		});
		
		it('should allow a group creation with password', function(done) {
			user.post('/group/create')
			.send({
				name: 'group 2 name',
				description: 'group number TWO',
				motto: 'never ever give up',
				password: 'encrypt this!!'
			})
			.expect(200, {
				success: true,
				body: {
					content: {
						id: 2
					}
				}
			}, done);
		});
	});
});