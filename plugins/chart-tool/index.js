import plugin from "./plugin.json";

export default function() {

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
