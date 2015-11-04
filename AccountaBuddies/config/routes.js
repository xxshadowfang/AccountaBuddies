/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

	

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
	
   	'POST /user/register': {
		controller: 'user',
		action: 'register'
	},
	
	'GET /user/get': {
		controller: 'user',
		action: 'find'
	},
	
	'POST /user/login': {
		controller: 'user',
		action: 'login'
	},
	
	'POST /user/logout': {
		controller: 'user',
		action: 'logout'
	},
	
	'POST /user/delete': {
		controller: 'user',
		action: 'delete'
	},
	
	'POST /user/update': {
		controller: 'user',
		action: 'update'
	},
	
	'POST /goal/create': {
		controller: 'goal',
		action: 'create'
	},
	
	'GET /goal/find/:id': {
		controller: 'goal',
		action: 'find'
	},
	
	'GET /goal/list': {
		controller: 'goal',
		action: 'list'
	},
	
	'POST /goal/update/:id': {
		controller: 'goal',
		action: 'update'
	},
	
	'POST /goal/delete/:id': {
		controller: 'goal',
		action: 'delete'
	},
	
	'POST /goal/addStep': {
		controller: 'goal',
		action: 'addStep'
	},
	
	'POST /goal/removeStep': {
		controller: 'goal',
		action: 'removeStep'
	},
	
	'POST /comment/create/:goalId' : {
		controller: 'comment',
		action: 'create'
	},
	
	'GET /comment/:id' : {
		controller: 'comment',
		action: 'find'
	},
	
	'POST /comment/delete/:id' : {
		controller: 'comment',
		action: 'delete'
	},
	
	'POST /group/create' : {
		controller: 'group',
		action: 'create'
	},
	
	'GET /group/find/:id' : {
		controller: 'group',
		action: 'find'
	},
	
	'GET /group/list/:filter' : {
		controller: 'group',
		action: 'list'
	},
	
	'GET /group/members/:id' : {
		controller: 'group',
		action: 'members'
	},
	
	'POST /group/join' : {
		controller: 'group',
		action: 'addUser'
	},
	
	'POST /group/leave' : {
		controller: 'group',
		action: 'removeUser'
	},
	
	'POST /group/delete' : {
		controller: 'group',
		action: 'delete'
	}
};
