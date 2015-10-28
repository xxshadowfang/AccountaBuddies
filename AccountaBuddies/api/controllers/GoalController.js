module.exports = function() {

	return {

		create : function(req, res) {
			if (!req.body.name) {
				return sails.globals.jsonFailure(req, res, 'You must provide a name');
			}
			if (!req.body.description) {
				return sails.globals.jsonFailure(req, res, 'You must provide a description');
			}

			if (!sails.globals.isLoggedInUser(req.cookies.cookie,
					req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				var goal = {
						name: req.body.name,
						description: req.body.description
				}
				goal = sails.globals.encode(goal);
				
				cmd = "CALL createGoal('"+ req.cookies.id +"', '"+ 1 +"', '"+ goal.name +"', '"+ goal.description +"');";
				
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
				return sails.globals.jsonFailure(req, res, 'You must provide a goal id.');
			}
			
			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				// TODO: Use stored procedure
				Goal.findOne({id : req.param('id')}).exec(function(err, goal) {
					if (goal === undefined)
						return sails.globals.jsonFailure(req, res, 'Goal was not found.');
					if (err)
						return sails.globals.jsonFailure(req, res, err);

					retGoal = {
							id : goal.id,
							name : goal.name,
							status : goal.status,
							description : goal.description,
							createdAt : goal.createdAt
					}
					retGoal = sails.globals.encode(retGoal);
					
					return sails.globals.jsonSuccess(req, res, retGoal);
				});
			}
		},
		
		'delete' : function(req, res) {
			if (!req.param('id')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a goal id.');
			}
			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				cmd = "CALL `deleteGoal` ('"+ req.param('id') +"', '"+ req.cookies.id +"');";

				Goal.query(cmd, function(err, results) {
					if (err)
						return sails.globals.jsonFailure(req, res, err);
					
					return sails.globals.jsonSuccess(req, res);
				});
			}
		},
		
		update : function(req, res) {
			if (!req.param('id')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a goal id.');
			}
			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				var goal = {
						name: req.body.name,
						status: req.body.status,
						description: req.body.description
				}
				goal = sails.globals.encode(goal);
				
				cmd = "CALL `updateGoal` ('"+ req.param('id') +"', '"+ req.cookies.id +"', '"+ goal.status +"', '"+ goal.name +"', '"+ goal.description +"');";

				Goal.query(cmd, function(err, results) {
					if (err) 
						return sails.globals.jsonFailure(req, res, err);
					
					return sails.globals.jsonSuccess(req, res);
				});
			}
			
		}
	}
}();