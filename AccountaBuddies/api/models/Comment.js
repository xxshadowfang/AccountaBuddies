module.exports = function() {
	return {
		connection : 'accountaBuddiesMYSQL',
		attributes : {
			id : {
				type : 'integer',
				autoIncrement : true,
				primaryKey : true
			},
			goalId : {
				type : 'integer',
				model : 'Goal'
			},
			userId : {
				type : 'integer',
				model : 'User'
			},
			text : {
				type : 'string',
				maxLength : 255,
				required : true
			}
		// filter: {}???
		}
	}
}();