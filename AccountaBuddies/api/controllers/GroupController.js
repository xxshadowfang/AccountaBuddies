module.exports = function() {
	return {
		
		create : function(req, res) {
			if (!req.body.name) {
				return sails.globals.jsonFailure(req, res, 'You must provide a name');
			}
			if (!req.body.motto) {
				return sails.globals.jsonFailure(req, res, 'You must provide a motto');
			}
			if (!req.body.description) {
				return sails.globals.jsonFailure(req, res, 'You must provide a description');
			}
			
			if (!sails.globals.isLoggedInUser(req.cookies.cookie,
					req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				var password = '';
				if (req.body.password) password = req.body.password;
				
				var group = {
						name: req.body.name,
						motto: req.body.motto,
						description: req.body.description,
						password: password
				}
				group = sails.globals.encode(group);
				
				cmd = "CALL createGroup('"+ req.cookies.id +"', '"+ group.name +"', '"+ group.motto +"', '"+ group.description +"', '"+ group.password +"');";
				
				Group.query(cmd, function(err, results) {
					if (err) {
						console.log(err);
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}
					
					var groupId = results[0][0].id;
					
					return sails.globals.jsonSuccess(req, res, {id : groupId});
				});
			}
		},
		
		find : function(req, res) {
			if (!req.param('id')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a group id.');
			}
			
			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				// TODO: Use stored procedure
				Group.findOne({id : req.param('id')})
				.populate('users')
				.exec(function(err, group) {
					if (group === undefined)
						return sails.globals.jsonFailure(req, res, 'Group was not found.');
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}
					// TODO: I am unsure how we want to handle this when you have arrays inside an object. (array of users)
					// How should I decode it and reconstruct it back to the client?
					
					//console.log(group);
					return sails.globals.jsonSuccess(req, res, group);
				});
			}
		},
		
		addUser : function(req, res) {
			if (!req.param('groupId')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a group id');
			}
			
			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				cmd = "CALL addUserToGroup('"+ req.cookies.id +"', '"+ req.param('groupId') +"');";
			
				Group.query(cmd, function(err, results) {
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}
						
					return sails.globals.jsonSuccess(req, res);
				});
			}			
		},
		
		removeUser : function(req, res) {
			if (!req.param('groupId')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a group id');
			}
			
			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				cmd = "CALL removeUserFromGroup('"+ req.cookies.id +"', '"+ req.param('groupId') +"');";
			
				Group.query(cmd, function(err, results) {
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}
					
					return sails.globals.jsonSuccess(req, res);
				});
			}
		},
		
		'delete' : function(req, res) {
			if (!req.param('id')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a group id.');
			}
			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				cmd = "CALL `deleteGroup` ('"+ req.param('id') +"', '"+ req.cookies.id +"');";

				Goal.query(cmd, function(err, results) {
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}
						
					return sails.globals.jsonSuccess(req, res);
				});
			}
		}
	}
}();