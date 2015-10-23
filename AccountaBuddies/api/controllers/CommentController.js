module.exports = function() {
	
	return {
		create : function(req, res) {
			if (!req.body.text) {
				return sails.globals.jsonFailure(req, res, 'You must provide comment text');
			}
			
			if (!sails.globals.isLoggedInUser(req.cookies.cookie,
					req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				cmd = "CALL addGoalComment('"+ req.cookies.id +"', '"+ req.param('goalId') +"', '"
										+ req.body.text +"', '"+ req.body.rating +"', '"+ req.body.nsfw +"');";
				
				Goal.query(cmd, function(err, results) {
					if (err)
						return sails.globals.jsonFailure(req, res, err);
					
					var goalId = results[0][0].id;
					
					return sails.globals.jsonSuccess(req, res, {id : goalId});
				});
			}
		},
	
		
		find : function(req, res) {
			if (!req.param('id')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a comment id');
			}
			
			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				// TODO: USE STORED PROCEDURE
				Comment.find({id : req.param('id')}).exec(function(err, comment) {
					if (comment === undefined)
						return sails.globals.jsonFailure(req, res, 'Comment was not found.');
					if (err)
						return sails.globals.jsonFailure(req, res, err);
					
					return sails.globals.jsonSuccess(req, res, comment);
				});
			}
		},
		
		'delete' : function(req, res) {
			if (!req.param('id')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a comment id');
			}
			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				cmd = "CALL `deleteGoalComment` ('"+ req.param('id') +"', '"+ req.cookies.id +"');";

				Goal.query(cmd, function(err, results) {
					if (err)
						return sails.globals.jsonFailure(req, res, err);
					
					return sails.globals.jsonSuccess(req, res);
				});
			}
			
		}
	}
}();