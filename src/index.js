import loadJS from '../lib/loadJS';
import * as styles from '../lib/loadCSS';
import deps from '../plugins/export';

export default (function() {

  const turntable = window.__turntable = window.__turntable || {
    deps: deps,
    loaded: []
  };

  var d = deps.length;

  const headers = [],
    footers = [];

  while (d--) {
    ['header', 'footer'].forEach(function(type) {
      if (this.assets[type] && this.assets[type].length) {
        let arr = type === 'header' ? headers : footers;
        arr.push({
          name: this.name,
          basepath: this.basepath,
          assets: this.assets[type]
        });
      }
    }, deps[d]);
  }

  if (headers.length) {
    loadAssets(headers, () => {
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
  const depLength = depList.length;
  let d = depList.length,
    counter = 0;
  while (d--) {
    loadLoop(depList[d], depList[d].assets, () => {
      if (counter === depLength - 1) {
        cb();
      } else {
        counter++;
      }
    });
  }
}

function loadLoop(ref, items, cb) {
  const itemLength = items.length;
  for (var i = 0; i < itemLength; i++) {
    if (Array.isArray(items[i])) {
      loadLoop(ref, items[i], () => {
        items.shift();
        loadLoop(ref, items, cb);
      });
      break;
    } else {
      let type = checkExt(items[i]);
      loader(type, ref.basepath + items[i], () => {
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
  const css = /\.css$/,
    js = /\.js$/;
  if (css.test(path)) { return 'css'; }
  if (js.test(path)) { return 'js'; }
  return null;
}

function loader(type, path, cb) {
  if (type === 'js') {
    loadJS(path, () => {
      cb();
    });
  } else if (type === 'css') {
    let ss = styles.loadCSS(path);
    styles.onloadCSS(ss, () => {
      cb();
    });
  }
}
