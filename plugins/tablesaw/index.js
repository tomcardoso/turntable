import plugin from "./plugin.json";

export default function() {

  if (!plugin.versions) {
    return null;
  }

  return {
    name: plugin.name,
    basepath: plugin.basepath,
    priority: plugin.priority,
    assets: plugin.versions[Object.keys(plugin.versions)[0]]
  };

}
