
function hasFlag(flag, argv) {

    if (!flag) {
        throw new TypeError('flag argument is required!');
    }

    argv = argv || process.argv;

    const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');

    const pos = argv.indexOf(prefix + flag);

    const terminatorPos = argv.indexOf('--');

    return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);

}

module.exports=hasFlag;