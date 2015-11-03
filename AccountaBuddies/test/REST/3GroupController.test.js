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
				name: 'group to delete',
				description: 'group number one',
				motto: 'you should not give up'
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
		
		it('should allow a group creation', function(done) {
			user.post('/group/create')
			.send({
				name: 'group name',
				description: 'group number two',
				motto: 'never ever give up'
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
		
		it('should allow a group creation with password', function(done) {
			user.post('/group/create')
			.send({
				name: 'group 3 name',
				description: 'group number THREE',
				motto: 'never ever give up',
				password: 'encrypt this!!'
			})
			.expect(200, {
				success: true,
				body: {
					content: {
						id: 3
					}
				}
			}, done);
		});
	});
	
	describe('Delete group', function() {
		it('should deny group to be deleted without group id', function(done) {
			user.post('/group/delete')
			.send({})
			.expect(200, {
				success: false,
				content: 'You must provide a group id.'
			}, done);
		});
		
		it('should all group to be removed', function(done) {
			user.post('/group/delete')
			.send({
				id : 1
			})
			.expect(200, {
				success: true,
				body: {
					content: ''
				}
			}, done);
		});
	});
	
	describe('Add member to group', function() {
		it('should deny user to be added to group without group id', function(done) {
			user.post('/group/join')
			.send({
				password: 'test'
			})
			.expect(200, {
				success: false,
				content: 'You must provide a group id'
			}, done);
		});
		
		it('should deny user to be added to group without group password', function(done) {
			user.post('/group/join')
			.send({
				id: 1
			})
			.expect(200, {
				success: false,
				content: 'You must provide a group password'
			}, done);
		});
		
		it('should deny user to be added to group that they are already in', function(done) {
			user.post('/group/join')
			.send({
				id: 2,
				password: 'encrypt this!!'
			})
			.expect(200, {
				success: false,
				content: 'User is already in this group.'
			}, done);
		});
		
		it('should deny user to be added to group with invalid password', function(done) {
			user.post('/user/login')
			.send({
				username: 'collin2',
				password: 'test'
			})
			.expect(200)
			.end(function(err, res) {
				user.post('/group/join')
				.send({
					id: 3,
					password: 'encryptThis!!'
				})
				.expect(200, {
					success: false,
					content: 'Invalid group password.'
				}, done);
			});
		});
		
		it('should allow user to be added to group that has password', function(done) {
			user.post('/group/join')
			.send({
				id: 3,
				password: 'encrypt this!!'
			})
			.expect(200, {
				success: true,
				body : {
					content: ''
				}
			}, done);
		});
	});
	
	describe('Reading groups (find)', function() {
		it('should deny group to be read without id', function(done) {
			user.get('/group/find')
			.send({})
			.expect(200, {
				success: false,
				content: 'You must provide a group id.'
			}, done);
		});
		
		it('should find that group 1 does not exist anymore', function(done) {
			user.get('/group/find?id=1')
			.send({})
			.expect(200, {
				success: false,
				content: 'Group does not exist.'
			}, done);
		});
		
		it('should find group 2 correctly', function(done) {
			user.get('/group/find?id=2')
			.send({})
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				var group = res.body.body.content;
				
				expect(group.name).to.equal('group name');
				expect(group.description).to.equal('group number two');
				expect(group.motto).to.equal('never ever give up');
				
				done();
			});
		});
		
		it('should find group 3 correctly', function(done) {
			user.get('/group/find?id=3')
			.send({})
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				var group = res.body.body.content;
				
				expect(group.name).to.equal('group 3 name');
				expect(group.description).to.equal('group number THREE');
				expect(group.motto).to.equal('never ever give up');
				
				done();
			});
		});
	});
	
	describe('Reading groups (list)', function() {		
		it('should deny group to be listed without filter option', function(done) {
			user.get('/group/list')
			.send({})
			.expect(200, {
				success: false,
				content: 'You must provide a filter parameter'
			}, done);
		});
		
		it('should return all groups and user-joined/owned information for user two', function(done) {
			user.get('/group/list?filter=0')
			.send({})
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				var groups = res.body.body.content;
				
				expect(groups.length).to.equal(2);
				
				expect(groups[0].name).to.equal('group name');
				expect(groups[0].userCount).to.equal('1');
				expect(groups[0].isJoined).to.equal(false);
				expect(groups[0].isOwner).to.equal(false);
				
				expect(groups[1].name).to.equal('group 3 name');
				expect(groups[1].userCount).to.equal('2');
				expect(groups[1].isJoined).to.equal(true);
				expect(groups[1].isOwner).to.equal(false);
				
				done();
			});
		});
		
		it('should return user-joined groups for user two', function(done) {
			user.get('/group/list?filter=1')
			.send({})
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				var groups = res.body.body.content;
				
				expect(groups.length).to.equal(1);
				
				expect(groups[0].name).to.equal('group 3 name');
				expect(groups[0].userCount).to.equal('2');
				expect(groups[0].isJoined).to.equal(true);
				expect(groups[0].isOwner).to.equal(false);
				
				done();
			});
		});
		
		it('should return user-joined groups for user one', function(done) {
			user.post('/user/login')
			.send({
				username: 'collin',
				password: 'test'
			})
			.expect(200)
			.end(function(err, res) {
				user.get('/group/list?filter=1')
				.send({})
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err);
					var groups = res.body.body.content;
					
					expect(groups.length).to.equal(2);
					
					expect(groups[0].name).to.equal('group name');
					expect(groups[0].userCount).to.equal('1');
					expect(groups[0].isJoined).to.equal(true);
					expect(groups[0].isOwner).to.equal(true);
					
					expect(groups[1].name).to.equal('group 3 name');
					expect(groups[1].userCount).to.equal('2');
					expect(groups[1].isJoined).to.equal(true);
					expect(groups[1].isOwner).to.equal(true);
					
					done();
				});
			});
		});
		
		it('should return all groups for user one', function(done) {
			user.get('/group/list?filter=0')
			.send({})
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				var groups = res.body.body.content;
				
				expect(groups.length).to.equal(2);
				
				expect(groups[0].name).to.equal('group name');
				expect(groups[0].userCount).to.equal('1');
				expect(groups[0].isJoined).to.equal(true);
				expect(groups[0].isOwner).to.equal(true);
				
				expect(groups[1].name).to.equal('group 3 name');
				expect(groups[1].userCount).to.equal('2');
				expect(groups[1].isJoined).to.equal(true);
				expect(groups[1].isOwner).to.equal(true);
				
				done();
			});
		});
	});
});