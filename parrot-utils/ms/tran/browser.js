//@ts-ignore 
import supportsColor from '@parrotjs/supports-color';
import setup from './common';
var isSupport = supportsColor();

function formatArgs(args) {
  args[0] = "\n        ".concat(isSupport ? '%c' : '', "\n        ").concat(this.namespace, "\n        ").concat(isSupport ? ' %c' : ' ', "\n        ").concat(args[0], "\n        ").concat(isSupport ? '%c ' : ' ', "\n        +").concat(this.diffTime(this.diff), "\n    ");

  if (!isSupport) {
    return;
  }

  var c = "color: ".concat(this.color);
  args.splice(1, 0, c, 'color:inherit');
}

setup({
  formatArgs: formatArgs
});