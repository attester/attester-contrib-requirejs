# attester-contrib-requirejs

Use [RequireJS](http://requirejs.org/) inside attester.

## Getting Started

This plugin requires attester `~1.2.2`.

If you're not familiar with [attester](http://attester.ariatemplates.com) and its plugin system you can refer to [using attester as a module](http://attester.ariatemplates.com/usage/module.html). Once you know how to create a test campaign you can install the plugin with this command

````
npm install attester-contrib-requirejs --save-dev
````

Once the plugin has been installed, you can enable it inside your test script with this line of JavaScript

````
attester.plugins.require("attester-contrib-requirejs");
````

## Configuration

The plugin can be configured calling instead

````
attester.plugins.require("attester-contrib-requirejs", {
	// config options here
});
````

### data-main

The `data-main` attribute in the require.js script tag. It's a special attribute that require.js will check to start script loading.

    data-main: "script/main.js"

### includeBefore

Path to an additional script tag that will be loaded __before__ require.js.

    includeBefore: "/setup.js"

It is useful when you want to configure require.js as in

````html
<!-- example taken from http://requirejs.org/docs/api.html#config -->
<script>
    var require = {
        deps: ["some/module1", "my/module2", "a.js", "b.js"],
        callback: function(module1, module2) {
            //This function will be called when all the dependencies
            //listed above in deps are loaded. Note that this
            //function could be called before the page is loaded.
            //This callback is optional.
        }
    };
</script>
<script src="scripts/require.js"></script>
````

### includeAfter

Path to an additional script tag that will be loaded __after__ require.js.

    includeAfter: "/configuration.js"

It is useful when you want to configure require.js as in

````html
<!-- example taken from http://requirejs.org/docs/api.html#config -->
<script src="scripts/require.js"></script>
<script>
  require.config({
    baseUrl: "/another/path",
    paths: {
        "some": "some/v1.0"
    },
    waitSeconds: 15
  });
  require( ["some/module", "my/module", "a.js", "b.js"],
    function(someModule,    myModule) {
        //This function will be called when all the dependencies
        //listed above are loaded. Note that this function could
        //be called before the page is loaded.
        //This callback is optional.
    }
  );
</script>
````

### config

Specify the configuration for require.js directly in the test script, instead of including an additional file with either `includeBefore` or `includeAfter`.

    config: {
    	baseUrl: "require/module",
		paths: {
			math: "../math"
		},
		shim: {
			"backbone": {
				deps: ["underscore", "jquery"],
				exports: "Backbone"
			},
			"underscore": {
				exports: "_"
			}
		}
	}
