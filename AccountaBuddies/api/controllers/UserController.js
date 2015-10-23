module.exports = function() {
	var bcrypt = require('bcryptjs');

	return {

		find : function(req, res) {
			if (!req.param('id')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a user id.');
			}
			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				// TODO: USE STORED PROCEDURE
				User.findOne({id : req.body.id}).exec(function(err, user) {
					if (user === undefined)
						return sails.globals.jsonFailure(req, res, 'User was not found.');
					if (err)
						return sails.globals.jsonFailure(req, res, err);
	
					return sails.globals.jsonSuccess(req, res, user);
				});
			}
		},

		register : function(req, res) {
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

					var cmd = "CALL `registerUser` ('" + req.body.username
							+ "', '" + hash + "', '" + req.body.firstName
							+ "', '" + req.body.lastName + "', '"
							+ req.body.age + "', '" + req.body.gender + "', '"
							+ cookie + "');";

					User.query(cmd, function(err, results) {
						if (err) {
							return sails.globals.jsonFailure(req, res, err);
						}

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

			User.findOne({username : req.body.username}).exec(function(err, user) {
				if (user === undefined)
					return sails.globals.jsonFailure(req, res, 'User was not found.');
				if (err)
					return sails.globals.jsonFailure(req, res, err);

				bcrypt.compare(req.body.password, user.saltedPassword, function(err, result) {
					if (result) {
						var cookie = sails.globals.generateCookie();
						var cmd = "CALL `updateCookie` ('" + user.id + "', '" + cookie + "');";

						User.query(cmd, function(err, results) {
							if (err) {
								return sails.globals.jsonFailue(req, res, err);
							}

							res.cookie('cookie', cookie);
							res.cookie('id', user.id);

							sails.globals.cookieCache[cookie] = user.id;
							return sails.globals.jsonSuccess(req, res);
						});
					} else {
						return sails.globals.jsonFailure(req, res, 'Password did not match');
					}
				});
			});
		},

		logout : function(req, res) {
			var cookie = req.cookies.cookie;
			var id = req.cookies.id;

			delete sails.globals.cookieCache[cookie];

			var cmd = "CALL `updateCookie` ('" + id + "', '');";
			User.query(cmd, function(err, results) {
				if (err) {
					return sails.globals.jsonFailue(req, res, err);
				}

				return sails.globals.jsonSuccess(req, res);
			});
		}

	}
}();