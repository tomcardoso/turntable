var turntableInit = (function () {
'use strict';

/*! loadJS: load a JS file asynchronously. [c]2014 @scottjehl, Filament Group, Inc. (Based on http://goo.gl/REQGQ by Paul Irish). Licensed MIT */

/*! loadCSS: load a CSS file asynchronously. [c]2016 @scottjehl, Filament Group, Inc. Licensed MIT */

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

  const pluginObj = {
    name: plugin.name,
    basepath: plugin.basepath,
    priority: plugin.priority
  };

  const charts = window.__charttool;

  if (charts) {

    // find most common version and load that
    let j = charts.length;

    const versions = [];

    while (j--) {
      versions.push(charts[j].data.version);
    }

    pluginObj.assets = plugin.versions[mode(versions.sort())];
  } else {

    // using 1.0.2
    pluginObj.assets = plugin.versions["1.0.2"];
  }

  return pluginObj;
}

// taken from http://stackoverflow.com/a/1053865/602748
function mode(array) {

  let l = array.length;

  if (l === 0) {
    return null;
  }

  const modeMap = {};

  let maxEl = array[0],
      maxCount = 1;

  while (l--) {

    let el = array[l];

    if (modeMap[el] == null) {
      modeMap[el] = 1;
    } else {
      modeMap[el]++;
    }

    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }

  return maxEl;
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
var versions$2 = { "3.1.0": { "header": ["/3.3.7/js/bootstrap.min.js"], "footer": ["/3.3.7/css/bootstrap.min.css"] } };
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

const exports$1 = [charttool(), jquery(), bootstrap()];

// might be unnecessary if we just take the implicit order from up above
// exports.sort(function(a, b) {
//   return a.priority - b.priority;
// });

var deps = (function () {
  return exports$1;
})();

// export function load() {
//   // if "HEAD" is declared, load via XHR synchronously
//   // if not, defer rest of loading to bottom of page
//   // build dependency tree and
// }
//
// function loadSync(path, cb) {
//
//   // ideas borrowed from http://stackoverflow.com/questions/2879509/dynamically-loading-javascript-synchronously
//
//   // let xhrObj = new XMLHttpRequest();
//   // xhrObj.open('GET', path, false);
//   // xhrObj.send(null);
//   // eval(xhrObj.responseText);
//
//   let s = document.createElement('script');
//   s.type = "text/javascript";
//   s.src = path;
//   if (cb) {
//     s.onload = cb;
//     tag.onreadystatechange = cb; // for IE8
//   }
//
//   document.body.appendChild(s);
// }
//
// function getScript(src, callback) {
//   var s = document.createElement('script');
//   s.src = src;
//   s.async = true;
//   s.onreadystatechange = s.onload = function() {
//     if (!callback.done && (!s.readyState || /loaded|complete/.test(s.readyState))) {
//       callback.done = true;
//       callback();
//     }
//   };
//   document.querySelector('head').appendChild(s);
// }
//


function loadSync(scripts, basepath, cb) {

  const loadScript = function (src) {
    let xmlhttp, next;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      try {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        return;
      }
    };

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        let fn = new Function(xmlhttp.responseText);
        fn();
        next = scripts.shift();
        if (next) {
          loadScript(next);
        } else if (typeof cb == 'function') {
          cb();
        }
      }
    };
    xmlhttp.open("GET", basepath + src, true);
    xmlhttp.send();
  };

  loadScript(scripts.shift());
}

// function loadScripts(uris, whenDone) {
//   if (!uris.length) whenDone && whenDone();
//   else {
//     for (var wait = [], i = uris.length; i--;) {
//       var tag = document.createElement('script');
//       tag.type = 'text/javascript';
//       tag.src = uris[i];
//       if (whenDone) {
//         wait.push(tag)
//         tag.onload = maybeDone;
//         tag.onreadystatechange = maybeDone; // For IE8-
//       }
//       document.body.appendChild(tag);
//     }
//   }
//
//   function maybeDone() {
//     if (this.readyState === undefined || this.readyState === 'complete') {
//       // Pull the tags out based on the actual element in case IE ever
//       // intermingles the onload and onreadystatechange handlers for the same
//       // script block before notifying for another one.
//       for (var i = wait.length; i--;)
//         if (wait[i] == this) wait.splice(i, 1);
//       if (!wait.length) whenDone();
//     }
//   }
// }

var index = (function () {

  const turntable = window.__turntable = window.__turntable || {
    deps: deps,
    loaded: []
  };

  var d = deps.length;

  const headers = [];

  while (d--) {
    if (deps[d].assets.header && deps[d].assets.header.length) {
      headers.push({
        name: deps[d].name,
        basepath: deps[d].basepath,
        assets: deps[d].assets.header
      });
    }
  }

  if (headers.length) {
    loadHeaders(headers, function () {
      console.log("headers loaded!");
    });
  }

  // for (var i = 0; i < deps.length; i++) {
  //   loadDep(deps[i]);
  // }
})();

function loadHeaders(headers, cb) {
  let h = headers.length;
  let counter = 0;
  while (h--) {
    loadDep(headers[h], loadSync, function () {
      counter++;
      if (counter === headers.length) {
        cb();
      }
    });
  }
}

// function loadSync(param, cb) {
//   console.log(param);
// }

function loadDep(dep, loadFn, cb) {
  // console.log(dep.assets);

  loadFn(dep.assets, dep.basepath);
  // if (headers.length) {
  //   loadHeaders(headers.reverse(), function() {
  //     loadLoop(deps);
  //   });
}

return index;

}());
//# sourceMappingURL=turntable.js.map
