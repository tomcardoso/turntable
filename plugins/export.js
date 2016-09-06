import charttool from './chart-tool/index';
import jquery from './jquery/index';
import bootstrap from './bootstrap/index';
import tablesaw from './tablesaw/index';

const exports = [
  charttool(),
  jquery(),
  bootstrap(),
  tablesaw()
];

// might be unnecessary if we just take the implicit order from up above
// exports.sort(function(a, b) {
//   return a.priority - b.priority;
// });

export default (function() {
  return exports;
})();
