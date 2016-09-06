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


export function loadSync(scripts, basepath, cb) {

  const loadScript = function(src) {
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

    xmlhttp.onreadystatechange = function() {
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
    }
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
