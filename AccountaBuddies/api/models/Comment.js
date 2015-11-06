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
			},
			rating : {
				type : 'integer',
				enum : [ 1, 2, 3, 4, 5 ],
				defaultTo : 3
			},
			nsfw : {
				type : 'boolean',
				defaultTo : false
			}
		// filter: {}???
		}
	}
}();