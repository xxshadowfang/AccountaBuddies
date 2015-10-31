module.exports = function() {
	return {
		connection: 'accountaBuddiesMYSQL',
		attributes: {
			id: {
				type: 'integer',
				autoIncrement: true,
				primaryKey: true
			},
			goalId: {
				type: 'integer',
				model: 'Goal'
			},
			title: {
				type: 'string',
				required: true
			},
			description: {
				type: 'string',
				required: true
			},
			progress: {
				type: 'double'
			},
			amountWorked: {
				type: 'integer'
			},
			sequence: {
				type: 'integer'
			}
		}
	}
}();