var Route = require('./route.js'),
	_ = require ('underscore'),
	routes = [];

//helper function
function mergeOptions(userOptions, moduleOptions) {
	return _.extend ( _.clone(userOptions), moduleOptions );
}

//function pulls together the most common combination of routes
//options object expects: filters, path, verb, resourceType
//filters and path should be supplied at constructor invocation
module.exports = function	(basePath, options) {

	var routes = [];

	//little helper to use the Route constructor and partially apply the options that won't change within this function
	var RouteConstructor = function (verb, resourceType) {
		return new Route (basePath, _.extend ( _.clone(options), {verb: verb, resourceType: resourceType} ));
	}

	//GET route for collection
	routes.push(new RouteConstructor ('GET', 'collection'));

	//POST route for collection
	routes.push(new RouteConstructor ('POST', 'collection'));

	//GET route for document
	routes.push(new RouteConstructor ('GET', 'document'));

	//PUT route for document
	routes.push(new RouteConstructor ('PUT', 'document'));

	//DELETE route for document
	routes.push(new RouteConstructor ('DELETE', 'document'));

	return(routes);

};


