module.exports = function() {
	
	return {
		create : function(req, res) {
			if (!req.body.text) {
				return sails.globals.jsonFailure(req, res, 'You must provide comment text');
			}
			if (!req.param('goalId')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a goal id');
			}
			
			if (!sails.globals.isLoggedInUser(req.cookies.cookie,
					req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				var comment = {
						goalId: req.param('goalId'),
						text: req.body.text,
						rating: req.body.rating,
						nsfw: req.body.nsfw
				}
				comment = sails.globals.encode(comment);
				
				cmd = "CALL addGoalComment('"+ req.cookies.id +"', '"+ comment.goalId +"', '"
										+ comment.text +"', '"+ comment.rating +"', '"+ comment.nsfw +"');";

				Comment.query(cmd, function(err, results) {
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}
					
					var commentId = results[0][0].id;
					
					return sails.globals.jsonSuccess(req, res, {id : commentId});
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
				Comment.findOne({id : req.param('id')}).exec(function(err, comment) {
					if (comment === undefined)
						return sails.globals.jsonFailure(req, res, 'Comment was not found.');
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}
					
					retComment = {
						id : comment.id,
						goalId : comment.goalId,
						userId : comment.userId,
						text : comment.text,
						rating : comment.rating,
						nsfw : comment.nsfw
					}
					
					retComment = sails.globals.decode(retComment);
					
					return sails.globals.jsonSuccess(req, res, retComment);
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