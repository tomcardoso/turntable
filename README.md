# turntable.js

![](https://upload.wikimedia.org/wikipedia/commons/5/57/1961_-_Central_RR_Of_New_Jersey_Roundtable_and_Locomomotive_Yard.jpg)

Problem: you made something using the old Google Maps API three years ago, so you added the API script tag to your HTML template. Then, last week, you wanted to use the API again, which is now at v14 and, of course, isn't backwards compatible. Including the new script in your templates will work for newer stuff, but break all the old stuff that relied on a previous version.

What do you do?

![](http://i.giphy.com/J0u9EIYUoAJwI.gif)

This is a classic problem for anyone working in a content management system over several years. I was curious if I could come up with a client-side-only solution, so I wrote up *turntable*.

### How it works

All dependencies are defined as plugins. Plugins have two files: the dependency definition at `plugin.json`, and a loader file (`index.js`) that describes how to select the appropriate version.

At its most basic, `plugin.json` looks like this:

```json
{
  "name": "jquery",
  "priority": 200,
  "basepath": "https://code.jquery.com",
  "versions": {
    "3.1.0": {
      "footer": [ "/jquery-3.1.0.min.js" ]
    }
  }
}
```

Dependencies can be declared as being either in the header or footer. Dependencies in the header will all be loaded first. Listed dependencies will be loaded in the order they appear in their version arrays.

If you want to load files in parallel, you can do so by wrapping those paths in an array, like so:

```json
{
  "footer": [
    [
      "/chart-tool/1.1.0/bundle.min.css",
      "/chart-tool/1.1.0/d3.min.js"
    ],
    "/chart-tool/1.1.0/bundle.min.js"
  ]
}

```

In the case above, `bundle.min.css` and `d3.min.js` will be loaded before `bundle.min.js` is allowed to load.

### Why?

This is mostly a proof-of-concept, and I wanted to learn a bit more about synchronous and asynchronous JS and CSS requests and get a bit more familiar with ES6-style imports. I was also trying to make the library as lean as possible: there are no dependencies beyond the Filament Group's [loadJS](https://github.com/filamentgroup/loadJS) and [loadCSS](https://github.com/filamentgroup/loadCSS). All together, *turntable* comes in under 1kb minified and gzipped without defined plugins.

### Setup

You only need two commands to get going:

```sh
$ npm install
$ npm run start
```

If you're curious to see what the library does, check out the test page at `test/chart-tool.html`.

If you want to build the library, you can run:

```sh
$ npm build
```

Or, for a minified version:


```sh
$ npm build:prod
```


### Author

[It me](http://www.tomcardoso.com).

### License

MIT, 2016.
