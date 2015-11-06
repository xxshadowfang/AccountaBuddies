module.exports = function() {
	return {
	connection: 'accountaBuddiesMYSQL',
		attributes: {
			id: {
				type: 'integer',
				autoIncrement: true,
				primaryKey: true
			},
			userId: {
				type: 'integer',
				model: 'User'
			},
			status: {
				type: 'integer',
				defaultsTo: 1,
				enum: [1, 2, 3]
			},
			name: {
				type: 'string',
				maxLength: 50,
				required: true
			},
			description: {
				type: 'string',
				maxLength: 255,
				required: true
			},
			comments: {
				collection: 'Comment',
				via: 'goalId'
			},
			duration: {
				type: 'integer'
			},
			numSteps: {
				type: 'integer'
			}
			// privacy: 'STRING'
		}
	}
}();