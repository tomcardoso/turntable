var turntableInit = (function () {
'use strict';

/*! loadJS: load a JS file asynchronously. [c]2014 @scottjehl, Filament Group, Inc. (Based on http://goo.gl/REQGQ by Paul Irish). Licensed MIT */
function loadJS(src, cb) {
  "use strict";

  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = false;
  script.defer = false;
  ref.parentNode.insertBefore(script, ref);
  if (cb && typeof cb === "function") {
    script.onload = cb;
  }
  return script;
}

/*! loadCSS: load a CSS file asynchronously. [c]2016 @scottjehl, Filament Group, Inc. Licensed MIT */
function loadCSS(href, before, media) {
  // Arguments explained:
  // `href` [REQUIRED] is the URL for your CSS file.
  // `before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
  // By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
  // `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'
  var doc = window.document;
  var ss = doc.createElement('link');
  var ref;
  if (before) {
    ref = before;
  } else {
    var refs = (doc.body || doc.getElementsByTagName('head')[0]).childNodes;
    ref = refs[refs.length - 1];
  }

  var sheets = doc.styleSheets;
  ss.rel = 'stylesheet';
  ss.href = href;
  // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
  ss.media = 'only x';

  // wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
  function ready(cb) {
    if (doc.body) {
      return cb();
    }
    setTimeout(function () {
      ready(cb);
    });
  }
  // Inject link
  // Note: the ternary preserves the existing behavior of 'before' argument, but we could choose to change the argument to 'after' in a later release and standardize on ref.nextSibling for all refs
  // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
  ready(function () {
    ref.parentNode.insertBefore(ss, before ? ref : ref.nextSibling);
  });
  // A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
  var onloadcssdefined = function onloadcssdefined(cb) {
    var resolvedHref = ss.href;
    var i = sheets.length;
    while (i--) {
      if (sheets[i].href === resolvedHref) {
        return cb();
      }
    }
    setTimeout(function () {
      onloadcssdefined(cb);
    });
  };

  function loadCB() {
    if (ss.addEventListener) {
      ss.removeEventListener('load', loadCB);
    }
    ss.media = media || 'all';
  }

  // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
  if (ss.addEventListener) {
    ss.addEventListener('load', loadCB);
  }
  ss.onloadcssdefined = onloadcssdefined;
  onloadcssdefined(loadCB);
  return ss;
}

/*! onloadCSS: adds onload support for asynchronous stylesheets loaded with loadCSS. [c]2016 @zachleat, Filament Group, Inc. Licensed MIT */
function onloadCSS(ss, callback) {
  var called;

  function newcb() {
    if (!called && callback) {
      called = true;
      callback.call(ss);
    }
  }
  if (ss.addEventListener) {
    ss.addEventListener('load', newcb);
  }
  if (ss.attachEvent) {
    ss.attachEvent('onload', newcb);
  }

  // This code is for browsers that don’t support onload
  // No support for onload (it'll bind but never fire):
  //	* Android 4.3 (Samsung Galaxy S4, Browserstack)
  //	* Android 4.2 Browser (Samsung Galaxy SIII Mini GT-I8200L)
  //	* Android 2.3 (Pantech Burst P9070)

  // Weak inference targets Android < 4.4
  if ('isApplicationInstalled' in navigator && 'onloadcssdefined' in ss) {
    ss.onloadcssdefined(newcb);
  }
}

var name = "chart-tool";
var priority = 100;
var basepath = "http://beta.images.theglobeandmail.com/static/templates/tools";
var versions = { "1.0.2": { "header": ["/charts/1.0.0/scripts/gm-chart-loader.js"], "footer": [["/charts/1.0.0/css/gm-chart-lib.css", "/charts/1.0.0/scripts/d3.min.js"], "/charts/1.0.0/scripts/gm-chart-lib.js"] }, "1.1.0": { "footer": [["/chart-tool/1.1.0/bundle.min.css", "/chart-tool/1.1.0/d3.min.js"], "/chart-tool/1.1.0/bundle.min.js"] } };
var plugin = {
	name: name,
	priority: priority,
	basepath: basepath,
	versions: versions
};

function charttool () {

  // some basic logic about how to decide which version to load

  if (!plugin.versions) {
    return null;
  }

  var pluginObj = {
    name: plugin.name,
    basepath: plugin.basepath,
    priority: plugin.priority
  };

  var charts = window.__charttoolversion;

  pluginObj.assets = charts ? plugin.versions[charts] : plugin.versions['1.0.2'];

  return pluginObj;
}

var name$1 = "jquery";
var priority$1 = 200;
var basepath$1 = "https://code.jquery.com";
var versions$1 = { "3.1.0": { "footer": ["/jquery-3.1.0.min.js"] } };
var plugin$1 = {
	name: name$1,
	priority: priority$1,
	basepath: basepath$1,
	versions: versions$1
};

function jquery () {

  if (!plugin$1.versions) {
    return null;
  }

  return {
    name: plugin$1.name,
    basepath: plugin$1.basepath,
    priority: plugin$1.priority,
    assets: plugin$1.versions[Object.keys(plugin$1.versions)[0]]
  };
}

var name$2 = "bootstrap";
var priority$2 = 200;
var basepath$2 = "https://maxcdn.bootstrapcdn.com/bootstrap";
var versions$2 = { "3.1.0": { "header": ["/3.3.7/css/bootstrap.min.css"], "footer": ["/3.3.7/js/bootstrap.min.js"] } };
var plugin$2 = {
	name: name$2,
	priority: priority$2,
	basepath: basepath$2,
	versions: versions$2
};

function bootstrap () {

  if (!plugin$2.versions) {
    return null;
  }

  return {
    name: plugin$2.name,
    basepath: plugin$2.basepath,
    priority: plugin$2.priority,
    assets: plugin$2.versions[Object.keys(plugin$2.versions)[0]]
  };
}

var name$3 = "tablesaw";
var priority$3 = 200;
var basepath$3 = "http://beta.images.theglobeandmail.com/static/templates/table-d-hote";
var versions$3 = { "1.0.5": { "footer": ["/style/tablesaw.min.v1.css", "/scripts/tablesaw.min.v2.js"] } };
var plugin$3 = {
	name: name$3,
	priority: priority$3,
	basepath: basepath$3,
	versions: versions$3
};

function tablesaw () {

  if (!plugin$3.versions) {
    return null;
  }

  return {
    name: plugin$3.name,
    basepath: plugin$3.basepath,
    priority: plugin$3.priority,
    assets: plugin$3.versions[Object.keys(plugin$3.versions)[0]]
  };
}

var exports$1 = [charttool(), jquery(), bootstrap(), tablesaw()];

// might be unnecessary if we just take the implicit order from up above
// exports.sort(function(a, b) {
//   return a.priority - b.priority;
// });

var deps = (function () {
  return exports$1;
})();

var index = (function () {

  var turntable = window.__turntable = window.__turntable || {
    deps: deps,
    loaded: []
  };

  var d = deps.length;

  var headers = [],
      footers = [];

  while (d--) {
    ['header', 'footer'].forEach(function (type) {
      if (this.assets[type] && this.assets[type].length) {
        var arr = type === 'header' ? headers : footers;
        arr.push({
          name: this.name,
          basepath: this.basepath,
          assets: this.assets[type]
        });
      }
    }, deps[d]);
  }

  if (headers.length) {
    loadAssets(headers, function () {
      if (footers.length) {
        // bind to some kind of domready event?
        loadAssets(footers, noop);
      }
    });
  } else if (footers.length) {
    // bind to some kind of domready event?
    loadAssets(footers, noop);
  }
})();

function noop() {}

function loadAssets(depList, cb) {
  var depLength = depList.length;
  var d = depList.length,
      counter = 0;
  while (d--) {
    loadLoop(depList[d], depList[d].assets, function () {
      if (counter === depLength - 1) {
        cb();
      } else {
        counter++;
      }
    });
  }
}

function loadLoop(ref, items, cb) {
  var itemLength = items.length;
  for (var i = 0; i < itemLength; i++) {
    if (Array.isArray(items[i])) {
      loadLoop(ref, items[i], function () {
        items.shift();
        loadLoop(ref, items, cb);
      });
      break;
    } else {
      var type = checkExt(items[i]);
      loader(type, ref.basepath + items[i], function () {
        items.shift();
        if (items.length) {
          loadLoop(ref, items, cb);
        } else {
          cb();
        }
      });
      break;
    }
  }
}

function checkExt(path) {
  var css = /\.css$/,
      js = /\.js$/;
  if (css.test(path)) {
    return 'css';
  }
  if (js.test(path)) {
    return 'js';
  }
  return null;
}

function loader(type, path, cb) {
  if (type === 'js') {
    loadJS(path, function () {
      cb();
    });
  } else if (type === 'css') {
    var ss = loadCSS(path);
    onloadCSS(ss, function () {
      cb();
    });
  }
}

return index;

}());
//# sourceMappingURL=turntable.js.map
