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
				cmd = "CALL `getGroupInfo`('"+ req.cookies.id +"', '"+ req.param('id') +"');";

				Group.query(cmd, function(err, results) {
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}

					var groupInfo = results[0][0];
					var userInfo = results[1][0];

					var group = {
							name: groupInfo.name,
							description: groupInfo.description,
							motto: groupInfo.motto,
							isOwner: userInfo.isOwner,
							isJoined: userInfo.isJoined
					}
					group = sails.globals.decode(group);

					return sails.globals.jsonSuccess(req, res, group);
				});
			}
		},

		list : function(req, res) {
			if (!req.param('filter')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a filter parameter');
			}

			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				cmd = "CALL `getGroupList`('"+ req.cookies.id +"', '"+ req.param('filter') +"');";

				Group.query(cmd, function(err, results) {
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}

					var groupInfo = results[0];
					var groups = {items: []};

					for (var i = 0; i < groupInfo.length; i++) {
						groups.items[i] = sails.globals.decode(groupInfo[i]);

						// isJoined and isOwner need to be bools for client
						if(groups.items[i].isJoined == 'null') {
							groups.items[i].isJoined = false;
						} else {
							groups.items[i].isJoined = true;
						}

						if(parseInt(groups.items[i].ownerId) == req.cookies.id) {
							groups.items[i].isOwner = true;
						} else {
							groups.items[i].isOwner = false;
						}
					}

					return sails.globals.jsonSuccess(req, res, groups.items);
				});
			}
		},

		members : function(req, res) {
			if (!req.param('id')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a group id');
			}

			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				cmd = "CALL `getGroupMembers`('"+ req.param('id') +"');";

				Group.query(cmd, function(err, results) {
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}

					var groupMembers = results[0];
					var members = {items: []};

					for (var i = 0; i < groupMembers.length; i++) {
						members.items[i] = sails.globals.decode(groupMembers[i]);
					}

					return sails.globals.jsonSuccess(req, res, members.items);
				});
			}
		},

		addUser : function(req, res) {
			if (!req.param('id')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a group id');
			}

			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				cmd = "CALL addUserToGroup('"+ req.cookies.id +"', '"+ req.param('id') +"', '"+ req.param('password') +"');";

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
			if (!req.param('id')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a group id');
			}

			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				cmd = "CALL removeUserFromGroup('"+ req.cookies.id +"', '"+ req.param('id') +"');";

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
