module.exports = function() {

	return {

		create : function(req, res) {
			if (!req.body.name) {
				return sails.globals.jsonFailure(req, res, 'You must provide a name');
			}
			if (!req.body.description) {
				return sails.globals.jsonFailure(req, res, 'You must provide a description');
			}
			if (!req.body.steps) {
				return sails.globals.jsonFailure(req, res, 'You must provide step(s)');
			}
			if (req.body.steps.constructor !== Array) {
				return sails.globals.jsonFailure(req, res, 'You must send in an array of steps');
			}

			if (!sails.globals.isLoggedInUser(req.cookies.cookie,
					req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				// add goal
				var goal = {
						name: req.body.name,
						description: req.body.description
				}
				goal = sails.globals.encode(goal);
				
				cmd = "CALL createGoal('"+ req.cookies.id +"', '"+ 1 +"', '"+ goal.name +"', '"+ goal.description +"');";
				
				Goal.query(cmd, function(err, results) {
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res);
					}
						
					var goalId = results[0][0].id;
					
					// add steps
					var steps = req.body.steps;					
					var sequence = 0;
					steps.forEach(function(step) {
						sequence++;
						
						var encodedStep = {
								title: step.title,
								description: step.description,
								sequence: sequence,
								duration: step.duration
						}
						encodedStep = sails.globals.encode(encodedStep);
						
						cmd = "CALL `addStepToGoal` ('" + goalId + "', '"
						+ step.title + "', '" + step.description
						+ "', '"+ step.duration +"', '"+ sequence +"');";
						
						Step.query(cmd, function(err, results) {
							if (err) {
								var errMsg = sails.globals.errorCodes[String(err.sqlState)];
								return sails.globals.jsonFailure(req, res, errMsg);
							}
						});
					});
					
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
				Goal.findOne({id : req.param('id')})
				.populate('steps')
				.populate('comments')
				.exec(function(err, goal) {
					if (goal === undefined)
						return sails.globals.jsonFailure(req, res, 'Goal was not found.');
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}

					steps = [];
					goal.steps.forEach(function(step) {
						steps.push(sails.globals.decode(step));
					});
					
					comments = [];
					goal.comments.forEach(function(comment) {
						comments.push(sails.globals.decode(comment));
					});
					
					retGoal = {
							id : goal.id,
							name : goal.name,
							status : goal.status,
							description : goal.description,
							createdAt : goal.createdAt,
							numSteps : goal.numSteps,
							progress: goal.progress
					}
					
					retGoal = sails.globals.decode(retGoal);
					retGoal.steps = steps;
					retGoal.comments = comments;
					
					return sails.globals.jsonSuccess(req, res, retGoal);
				});
			}
		},
		
		list : function(req, res) {
			if (!sails.globals.isLoggedInUser(req.cookies.cookie, req.cookies.id)) {
				return sails.globals.jsonFailure(req, res, 'You must be logged in to do this');
			} else {
				cmd = "CALL `getGoalList` ('"+ req.cookies.id +"');";
				Goal.query(cmd, function(err, results) {
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}
					
					return sails.globals.jsonSuccess(req, res, results[0]);
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
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}
					
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
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}
					
					return sails.globals.jsonSuccess(req, res);
				});
			}
		},
		
		addStep : function(req, res) {
			if (!req.param('title')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a title.');
			}
			if (!req.param('description')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a description.');
			}
			if (!req.param('goalId')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a goal id.');
			}
			if (!req.param('sequence')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a sequence.');
			}
			if (!req.param('duration')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a duration.');
			}
			
			if (!sails.globals.isLoggedInUser(req.cookies.cookie,
					req.cookies.id)) {
				return sails.globals.jsonFailure(req, res,
						'You must be logged in to do this');
			} else {
				var step = {
					goalId: req.body.goalId,
					title: req.body.title,
					description: req.body.description,
					sequence: req.body.sequence,
					duration: req.body.duration
				}
				step = sails.globals.encode(step);
				
				cmd = "CALL `addStepToGoal` ('" + step.goalId + "', '"
						+ step.title + "', '" + step.description
						+ "', '"+ step.duration +"', '"+ step.sequence +"');";

				Step.query(cmd, function(err, results) {
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}

					var stepId = results[0][0].id;
					return sails.globals.jsonSuccess(req, res, {id : stepId});
				});
			}
		},
		
		removeStep: function(req, res) {
			if (!req.param('id')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a step id.');
			}
			if (!req.param('goalId')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a goal id.');
			}
			
			if (!sails.globals.isLoggedInUser(req.cookies.cookie,
					req.cookies.id)) {
				return sails.globals.jsonFailure(req, res,
						'You must be logged in to do this');
			} else {
				cmd = "CALL `removeStepFromGoal` ('"+ req.body.goalId +"', '"+ req.body.id +"', '"+ req.cookies.id +"');";
				
				Step.query(cmd, function(err, results) {
					if (err) {
						var errMsg = sails.globals.errorCodes[String(err.sqlState)];
						return sails.globals.jsonFailure(req, res, errMsg);
					}
					
					return sails.globals.jsonSuccess(req, res);
				});
			}
		},
		
		updateStep: function(req, res) {
			if (!req.param('id')) {
				return sails.globals.jsonFailure(req, res, 'You must provide a step id.');
			}
			if (!req.param('amountWorked')) {
				return sails.globals.jsonFailure(req, res, 'You must provide an amount worked.');
			}
			
			if (!sails.globals.isLoggedInUser(req.cookies.cookie,
					req.cookies.id)) {
				return sails.globals.jsonFailure(req, res,
						'You must be logged in to do this');
			} else {
				cmd = "CALL `updateStep` ('"+ req.body.id +"', '"+ req.cookies.id +"', '"+ req.body.amountWorked +"');";
				
				Step.query(cmd, function(err, results) {
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