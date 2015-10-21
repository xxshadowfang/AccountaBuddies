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
				required : true
			},
			saltedPassword : {
				type : 'string',
				required : true
			},
			firstName : {
				type : 'string'
			},
			lastName : {
				type : 'string'
			},
			goals : {
				collection : 'Goal',
				via : 'userId'
			},
			comments : {
				collection : 'Comment',
				via : 'userId'
			}
		}
	}
}();