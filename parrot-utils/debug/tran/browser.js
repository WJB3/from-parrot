//@ts-ignore 
import supportsColor from '@parrotjs/supports-color';
import setup from './common';

function formatArgs(args) {
  args[0] = "\n        ".concat(supportsColor ? '%c' : '', "\n        ").concat(this.namespace, "\n        ").concat(supportsColor ? ' %c' : ' ', "\n        ").concat(args[0], "\n        ").concat(supportsColor ? '%c ' : ' ', "\n        +").concat(this.diffTime(this.diff), "\n    ");

  if (!supportsColor) {
    return;
  }

  var c = "color: ".concat(this.color);
  args.splice(1, 0, c, 'color:inherit');
}

export default setup({
  formatArgs: formatArgs
});