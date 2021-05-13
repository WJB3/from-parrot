const ttyNode = require('tty');
const hasFlagFunc = require('@parrotjs/has-flag');
const { env } = process;
let flagForceColor;
if (hasFlagFunc('no-color') ||
    hasFlagFunc('no-colors') ||
    hasFlagFunc('color=false') ||
    hasFlagFunc('color=never')) {
    flagForceColor = 0;
}
else if (hasFlagFunc('color') ||
    hasFlagFunc('colors') ||
    hasFlagFunc('color=true') ||
    hasFlagFunc('color=always')) {
    flagForceColor = 1;
}
function supportsColor(haveStream, { streamIsTTY } = {}) {
    if (flagForceColor === 0) {
        return 0;
    }
    if (haveStream && !streamIsTTY && flagForceColor === undefined) {
        return 0;
    }
    const min = flagForceColor || 0;
    if (env.COLORTERM === 'truecolor') {
        return 3;
    }
    return min;
}
function translateLevel(level) {
    if (level === 0) {
        return false;
    }
    return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
    };
}
function getSupportLevel(stream) {
    const level = supportsColor(stream, {
        streamIsTTY: stream && stream.isTTY
    });
    return translateLevel(level);
}
module.exports = {
    stdout: getSupportLevel({ isTTY: ttyNode.isatty(1) }),
    stderr: getSupportLevel({ isTTY: ttyNode.isatty(2) }),
};
