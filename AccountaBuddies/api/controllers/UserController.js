module.exports = function() {
	var bcrypt = require('bcryptjs');
	
	return {

		find : function(req, res) {
			if (!req.body.id) {
				return res.ok('You must provide a user id');
			}
			
			// TODO: USE STORED PROCEDURE
			User.findOne({id: req.body.id}.exec(function(err, user) {
				if (user === undefined)
					return res.notFound();
				if (err)
					return res.serverError(err);

				return res.ok(user);
			});
		},

		register : function(req, res) {
			if (!req.body.username) {
				return res.ok('You must provide a username');
			}
			if (!req.body.password) {
				return res.ok('You must provide a password');
			}
			
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(req.body.password, salt, function(err, hash) {					
					var cookie = sails.globals.generateCookie();
					// TODO: use real params
					var cmd = "CALL `registerUser` ('" + req.body.username + "', '" + hash + "', null, null, null, null,'" + cookie + "');";
					
					User.query(cmd, function(err, results) {
						if (err) {
							return res.serverError(err);
						}
						
						var userId = results[0][0].id;
						
						sails.globals.cookieCache[cookie] = userId;
						
						res.cookie('cookie', cookie);
						res.cookie('id', userId);
						
						return res.ok({
							success : true,
							content : {
								id : userId
							}
						});
					});
				});
			});
		},
		
		login : function(req, res) {
			if (!req.body.username) {
				return res.ok('You must provide a username');
			}
			if (!req.body.password) {
				return res.ok('You must provide a password');
			}
			
			User.findOne({username: req.body.username}).exec(function(err, user) {
				if (user === undefined)
					return res.notFound();
				if (err)
					return res.serverError(err);

				bcrypt.compare(req.body.password, user.saltedPassword, function(err, result) {
					
					if (result) {
						var cookie = sails.globals.generateCookie();
						var cmd = "CALL `updateCookie` ('" + user.id + "', '" + cookie + "');";
						
						User.query(cmd, function(err, results) {
							if (err) {
								return res.serverError(err);
							}
							
							res.cookie('cookie', cookie);
							res.cookie('id', user.id);
							
							return res.ok({
								success : true,
								content : {}
							});
						});
					} else {
						return res.ok({
							success : false,
							content : 'Password did not match.'
						});
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
					return res.serverError(err);
				}
				
				return res.ok({
					success : true,
					content : {}
				});
			});
		}

	}
}();