module.exports = function() {
	return {
		
		create : function(req, res) {
			if (!req.body.name) {
				return sails.globals.jsonFailure(req, res, 'You must provide a name');
			}
			if (!req.body.motto) {
				return sails.globals.jsonFailure(req, res, 'You must provide a motto');
			}
			
			if (!sails.globals.isLoggedInUser(req.cookies.cookie,
					req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				cmd = "CALL createGroup('"+ req.cookies.id +"', '"+ req.body.name +"', '"+ req.body.motto +"');";
				
				Group.query(cmd, function(err, results) {
					if (err)
						return sails.globals.jsonFailure(req, res, err);
					
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
					if (err)
						return sails.globals.jsonFailure(req, res, err);

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
					if (err)
						return sails.globals.jsonFailure(req, res, err);
					
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
					if (err)
						return sails.globals.jsonFailure(req, res, err);
					
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
					if (err)
						return sails.globals.jsonFailure(req, res, err);
					
					return sails.globals.jsonSuccess(req, res);
				});
			}
		}
	}
}();