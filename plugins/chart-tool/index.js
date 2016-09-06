import plugin from './plugin.json';

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

  const charts = window.__charttoolversion;

  pluginObj.assets = charts ? plugin.versions[charts] : plugin.versions['1.0.2'];

  return pluginObj;

}
