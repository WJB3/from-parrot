function hasFlag(flag, argv) {
  if (!flag) {
    throw new TypeError('flag argument is required!');
  }

  argv = argv || process.argv;
  var prefix = flag.startsWith('-') ? '' : flag.length === 1 ? '-' : '--';
  var pos = argv.indexOf(prefix + flag);
  var terminatorPos = argv.indexOf('--');
  return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
}

module.exports = hasFlag;