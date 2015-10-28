/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
	var uuid = require('uuid');
	var mysql = require('mysql');
	var request = require('supertest');
	
	sails.globals = sails.globals || {};
	
	//sails.globals.test = sails.globals.test || {};
	//sails.globals.test.request = request;
	
	sails.globals.encode = function(inputObj) {
		for (var key in inputObj) {
			if (inputObj.hasOwnProperty(key)) {
				inputObj[key] = String(inputObj[key]).replace(/&/g, '&amp;')
	               .replace(/</g, '&lt;')
	               .replace(/>/g, '&gt;')
	               .replace(/"/g, '&quot;')
	               .replace(/'/g, '&apos;'); 
			}
		}
		
		return inputObj;
	}
	
	sails.globals.decode = function(inputObj) {
		for (var key in inputObj) {
			if (inputObj.hasOwnProperty(key)) {
				inputObj[key] = String(inputObj[key]).replace(/&apos;/g, "'")
	               .replace(/&quot;/g, '"')
	               .replace(/&gt;/g, '>')
	               .replace(/&lt;/g, '<')
	               .replace(/&amp;/g, '&');  
			}
		}
		
		return inputObj;
	}
	
	sails.globals.generateCookie = function() {
		return uuid.v4();
	};
	
	sails.globals.isLoggedInUser = function(cookie, userId) {
		if (!cookie || !userId) return false;
		
		if (sails.globals.cookieCache[cookie] == userId) {
			return true;
		} else {
			return false;
		}
	}
	
	sails.globals.jsonSuccess = function(req, res, content) {
		return res.ok({
			success: true,
			body : {
				content : !content ? '' : content
			}
		});
	}
	
	sails.globals.jsonFailure = function(req, res, reason) {
		return res.ok({
			success : false,
			content : !reason ? 'failure with no reason :(' : reason
		})
	}
		
	// sets up the cache of the cookies
	// wasn't sure how this should be done, but sails.globals.cookieCache
	// is a key:value pair [cookie:userId] 
	getCookieCache = function() {
		var conn = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'accounta_buddies'
		});
		
		conn.connect();
		
		sails.globals.cookieCache = {};
		
		conn.query('CALL cacheCookies();', function(err, rows, fields) {
			if (err) {
				console.log(err);
			}
			
			for (row in rows[0]) {
				sails.globals.cookieCache[rows[0][row].cookie] = rows[0][row].id;
			}
		});
	}
	
	getCookieCache();
	
	cb();
};
