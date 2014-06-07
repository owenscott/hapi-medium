var	_ = require('underscore');


//little helper function
function getObjectKey(obj) {
	return Object.keys(obj)[0];
}

//returns a handler for /api/foo
var RequestHandler = function(options) {

	var dao = options.dao,
		actions;

	//hash of all possible actions for a backbone rest server
	actions = {
		collection: {
			get: dao.getCollection,
			post: dao.addObject
		},
		document: {
			get: dao.getObject,
			put: dao.updateObject,
			delete: dao.deleteObject
		}
	}

	//returns a handler
	return function(request, reply) {

		var action;

		if (actions[options.resourceType] && actions[options.resourceType][request.method]) {
			action = actions[options.resourceType][request.method];
			action(request, reply, options);
		}
		else {
			throw new Error('Invalid Request')
		}
	};

};



module.exports = function (basePath, options) {

	//set some defaults
	var filters = options.filters || {},
		path = basePath || '/',
		verb = options.verb || 'GET',
		resourceType = options.resourceType,
		tags = options.keys || [],
		description = options.description || 'None',
		collectionName;


	if (!resourceType) {
		throw new Error('No resource type (document or collection) specified for route.');
	}

	//iterate through each filter and add it to the path
	for (var f in filters) {

		if (filters.hasOwnProperty(f)) {

			//check if they made a common mistake by sending filters: {foo:'bar', baz:'ttt'} instead of filters: [{foo:'bar'}, {bas:'ttt'}]
			if (Object.keys(filters[f]).length > 1) {
				throw new Error('Your filter object has too many key/value pairs (max 1).');
			}

			//if no errot than add the filters to the path (form '/filterKey/{filterValue}')
			path = path + '/' + getObjectKey(filters[f]) + '/{' + filters[f][getObjectKey(filters[f])] + '}';
		
		}
	
	}

	//add the path segment for the resource being requested
	path = path + options.path;

	//path should not look like "basepath/filterKey/{filterValue}/resource"
	if (resourceType === 'document') {
		path = path + '/{_id}';
	}

	collectionName = options.collection || (options.path && options.path.replace(/\//, '')) || false; //TODO: add a regex to the second half to parse the end of the users object

	//return a hapi route object
	return {
		method: verb,
		path: path,
		config: {
			handler: new RequestHandler({
				collectionName: collectionName,
				projection: options.projection || {},
				resourceType: resourceType,
				dao: options.dao || {}
			}),
			validate: options.validation || {query: true},
			auth: false,
			tags: tags,
			description: description
		}
	};

};

