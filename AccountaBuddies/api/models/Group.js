module.exports = function() {
	return {
		connection : 'accountaBuddiesMYSQL',
		attributes : {
			id : {
				type : 'integer',
				autoIncrement : true,
				primaryKey : true
			},
			userId : {
				type : 'integer',
				model : 'User'
			},
			name : {
				type : 'string',
				maxLength : 50,
				required : true
			},
			motto : {
				type : 'string',
				maxLength : 50
			},
			description : {
				type : 'string'
			},
			password : {
				type : 'string'
			},
			userCount : {
				type : 'integer',
				defaultsTo : 1
			},
			users : {
				collection : 'User',
				via: 'groups'
			}
		// privacy: {}
		}
	}
}();