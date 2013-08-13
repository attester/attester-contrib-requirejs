/*
 * Copyright 2013 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var path = require("path");
var _ = require("lodash");

module.exports = function (attester, config) {
	// Get the middleware for the require JS file
	var middleware = attester.middlewares.staticFile.bind({
		page: "require.js",
		path: path.join(__dirname, "../bower_components/requirejs/require.js")
	});

	// And the one for the client part
	var client = attester.middlewares.staticFile.bind({
		page: "attester-require.js",
		path: path.join(__dirname, "client.js")
	});

	// Serve this file under requirejs
	attester.server.use("/requirejs", middleware);
	attester.server.use("/requirejs", client);

	// Include require js script with the main module
	var requireJS = {
		tagName: "script",
		src: "/requirejs/require.js"
	};
	if (config["data-main"]) {
		requireJS["data-main"] = "<%= data.baseURL %>/" + config["data-main"];
	}

	var head = [{
		tagName: "script",
		src: "/requirejs/attester-require.js"
	}, requireJS];

	// Include any configuration that was passed to the plugin
	if (config.config) {
		var requireConfig = normalizeConfig(config.config);
		head.push({
			tagName: "script",
			content: "require.config(" + stringify(requireConfig) + ");"
		});
	}

	// There might be script to be loaded before requireJS
	// see http://requirejs.org/docs/api.html#config
	if (config.includeBefore) {
		head.splice(0, 0, {
			tagName: "script",
			src: config.includeBefore
		});
	}
	if (config.includeAfter) {
		head.push({
			tagName: "script",
			src: config.includeAfter
		});
	}

	// Put everything in the page
	attester.testPage.include({
		head: head
	});
};

/**
 * Make sure that paths are valid for attester.
 * Require's baseUrl must be prefixed with the campaign baseURL,
 * the same should be done for absolute paths
 */
function normalizeConfig (config) {
	if (config.baseUrl) {
		config.baseUrl = "<%= data.baseURL %>/" + config.baseUrl;
	}
	if (config.paths) {
		_.forOwn(config.paths, function(path, key) {
			if (path.charAt(0) === "/") {
				config.paths[key] = "<%= data.baseURL %>" + path;
			}
		});
	}
	return config;
}

/**
 * This method works pretty much like JSON.stringify with the difference that
 * it converts functions to strings so that they can be evaluated as script.
 * It doesn't support functions inside arrays
 */
function stringify (config) {
	var keys = [];
	_.forOwn(config, function (value, key) {
		var asString = JSON.stringify(key) + ":";
		if (_.isFunction(value)) {
			asString += value.toString();
		} else if (_.isPlainObject(value)) {
			asString += stringify(value);
		} else {
			asString += JSON.stringify(value);
		}
		// I don't expect functions inside arrays
		keys.push(asString);
	});

	return "{" + keys.join(",") + "}";
}
