
var Hapi = require('hapi'),
	RestEndpointSet = require('./src/endpoints.js'),
	_ = require('underscore');


module.exports = function(routes, options) {

	var server = new Hapi.Server(options.url, options.port);

	routes = _.map(routes, function (route) {
		return new RestEndpointSet(route.basePath, {
			path: route.path,
			filters: route.filters,
			dao: route.dao
		})
	})

	routes = _.flatten(routes);

	server.route(routes);

	return server;
}
