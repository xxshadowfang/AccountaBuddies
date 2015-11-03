module.exports = function() {
	var bcrypt = require('bcryptjs');

	return {

		find : function(req, res) {
			/*
			 * Commented out while we only let users see their own profile/goals
			 *
			if (!req.param('id')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a user id.');
			}
			*/
			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				// TODO: USE STORED PROCEDURE
				User.findOne({id : req.cookies.id}).exec(function(err, user) {
					if (user === undefined)
						return sails.globals.jsonFailure(req, res, 'User was not found.');

					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}

					retUser = {
							id : user.id,
							username: user.username,
							firstName: user.firstName,
							lastName: user.lastName,
							age: user.age,
							gender: user.gender,
							createdAt: user.createdAt
					};

					retUser = sails.globals.decode(retUser);

					return sails.globals.jsonSuccess(req, res, retUser);
				});
			}
		},

		register : function(req, res) {
      console.log("register request received");
      console.log(req.body);
			if (!req.body.username) {
				return sails.globals.jsonFailure(req, res,
						'You must provide a username.');
			}
			if (!req.body.password) {
				return sails.globals.jsonFailure(req, res,
						'You must provide a password.');
			}

			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(req.body.password, salt, function(err, hash) {
					var cookie = sails.globals.generateCookie();


					var user = {
							username: req.param('username'),
							hash: hash,
							firstName: req.body.firstName,
							lastName: req.body.lastName
					}

					user = sails.globals.encode(user);

					var cmd = "CALL `registerUser` ('" + user.username
							+ "', '" + user.hash + "', '" + user.firstName
							+ "', '" + user.lastName + "', '" + cookie + "');";

					User.query(cmd, function(err, results) {
						if (err) {
							var errMsg = sails.globals.errorCodes[String(err.sqlState)];
							return sails.globals.jsonFailure(req, res, errMsg);
						}
            console.log("created");
						var userId = results[0][0].id;

						sails.globals.cookieCache[cookie] = userId;

						res.cookie('cookie', cookie);
						res.cookie('id', userId);

						return sails.globals.jsonSuccess(req, res, {
							id : userId
						});
					});
				});
			});
		},

		login : function(req, res) {
			if (!req.body.username) {
				return sails.globals.jsonFailure(req, res,
						'You must provide a username.');
			}
			if (!req.body.password) {
				return sails.globals.jsonFailure(req, res,
						'You must provide a password.');
			}

			var userInput = {
					username: req.body.username,
					password: req.body.password
			};
			userInput = sails.globals.encode(userInput);

			User.findOne({username : userInput.username}).exec(function(err, user) {
				if (user === undefined)
					return sails.globals.jsonFailure(req, res, 'User was not found.');
				if (err) {
					var errMsg = sails.globals.errorCodes[String(err.sqlState)];
					return sails.globals.jsonFailure(req, res, errMsg);
				}

				bcrypt.compare(userInput.password, user.saltedPassword, function(err, result) {
					if (result) {
						var cookie = sails.globals.generateCookie();
						var cmd = "CALL `updateCookie` ('" + user.id + "', '" + cookie + "');";

						User.query(cmd, function(err, results) {
							if (err) {
								var errMsg = sails.globals.errorCodes[String(err.sqlState)];
								return sails.globals.jsonFailure(req, res, errMsg);
							}

							res.cookie('cookie', cookie);
							res.cookie('id', user.id);

							sails.globals.cookieCache[cookie] = user.id;
							return sails.globals.jsonSuccess(req, res);
						});
					} else {
						return sails.globals.jsonFailure(req, res, 'Password did not match.');
					}
				});
			});
		},

		logout : function(req, res) {
			var cookie = req.cookies.cookie;
			var id = req.cookies.id;

			if (!sails.globals.isLoggedInUser(req.cookies.cookie,
					req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				delete sails.globals.cookieCache[cookie];

				var cmd = "CALL `updateCookie` ('" + id + "', '');";
				User.query(cmd, function(err, results) {
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
				return sails.globals.jsonFailure(req, res, 'You must provide a user id.');
			}
			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				cmd = "CALL `deleteUser` ('"+ req.param('id') +"', '"+ req.cookies.id +"');";

				User.query(cmd, function(err, results) {
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}
					
					return sails.globals.jsonSuccess(req, res);
				});
			}
		},
		
		update : function(req, res) {			
			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				User.findOne({id : req.cookies.id}).exec(function(err, user) {
					if (user === undefined)
						return sails.globals.jsonFailure(req, res, 'User does not exist.');
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}
	
					retUser = {
							id : user.id,
							firstName: user.firstName,
							lastName: user.lastName,
							age: user.age,
							gender: user.gender
					};
					
					retUser = sails.globals.decode(retUser);
					
					if (req.param('firstName')) {
						retUser.firstName = req.param('firstName');
					}
					if (req.param('lastName')) {
						retUser.lastName = req.param('lastName');
					}
					if (req.param('age')) {
						retUser.age = req.param('age');
					}
					if (req.param('gender')) {
						retUser.gender = req.param('gender');
					}
					
					retUser = sails.globals.encode(retUser);
					
					cmd = "CALL `updateUserInfo` ('"+ req.cookies.id +"', '"+ retUser.firstName +"', '"+ retUser.lastName +"', '"+ retUser.age +"', '"+ retUser.gender +"');";

					User.query(cmd, function(err, results) {
						if (err) {
							var errMsg = sails.globals.errorCodes[String(err.sqlState)];
							return sails.globals.jsonFailure(req, res, errMsg);
						}

						return sails.globals.jsonSuccess(req, res, results[0][0]);
					});
				});
			}
		}
	}
}();
