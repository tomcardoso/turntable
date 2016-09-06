import scripts from '../lib/loadJS';
import * as styles from '../lib/loadCSS';
import deps from '../plugins/export';
import { loadSync } from './load'

export default (function() {

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
    loadHeaders(headers, function() {
      console.log("headers loaded!");
    });
  }

  // for (var i = 0; i < deps.length; i++) {
  //   loadDep(deps[i]);
  // }

})();

function resolve(basepath, file) {

}

function loadHeaders(headers, cb) {
  let h = headers.length;
  let counter = 0;
  while (h--) {
    loadDep(headers[h], loadSync, function() {
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

function loadDeps(deps) {
  for (var i = 0; i < deps.length; i++) {
    loadDep(deps[i]);
  }
}

function loadDep(dep, loadFn, cb) {
  // console.log(dep.assets);

  loadFn(dep.assets, dep.basepath);
  // if (headers.length) {
  //   loadHeaders(headers.reverse(), function() {
  //     loadLoop(deps);
  //   });
}

function getAssets(dep) {

  // console.log(dep);
  // console.log(scripts);
  // need to get basepath
  // start by resolving and loading header files
  // for footer files, write them afterwards by using a dom event trigger for onload
  // when onload fires, resolve their load order, then load the remaining files

  // debugger;

}
