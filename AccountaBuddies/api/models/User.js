module.exports = function() {
	return {

		connection : 'accountaBuddiesMYSQL',
		attributes : {
			id : {
				type : 'integer',
				autoIncrement : true,
				primaryKey : true,
				required : true
			},
			username : {
				type : 'string',
				email : true,
				unique : true,
				required : true,
				maxLength : 255
			},
			saltedPassword : {
				type : 'string',
				maxLength : 60,
				required : true
			},
			firstName : {
				type : 'string'
			},
			lastName : {
				type : 'string'
			},
			age: {
				type: 'integer'
			},
			gender: {
				type: 'string',
				size: 1
			},
			cookie : {
				type : 'string'
			},
			goals : {
				collection : 'Goal',
				via : 'userId'
			},
			comments : {
				collection : 'Comment',
				via : 'userId'
			},
			groups : {
				collection : 'Group',
				via : 'users'
			}
		}
	}
}();