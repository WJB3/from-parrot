(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@parrotjs/which-type')) :
  typeof define === 'function' && define.amd ? define(['@parrotjs/which-type'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.MS = factory(global.whichType));
}(this, (function (whichType) { 'use strict';

  //@ts-ignore
  /**
   * 毫秒
   */

  var s = 1000;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  /**
   * 解析给定的' str '并返回毫秒数。
   */

  function parse(str) {
    str = String(str);

    if (str.length > 100) {
      return;
    }

    var reg = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i;
    var matches = reg.exec(str);

    if (!matches) {
      return;
    }

    var n = parseFloat(matches[1]);
    var type = (matches[2] || 'ms').toLowerCase();

    switch (type) {
      case 'years':
      case 'year':
      case 'yrs':
      case 'yr':
      case 'y':
        return n * y;

      case 'weeks':
      case 'week':
      case 'w':
        return n * w;

      case 'days':
      case 'day':
      case 'd':
        return n * d;

      case 'hours':
      case 'hour':
      case 'hrs':
      case 'hr':
      case 'h':
        return n * h;

      case 'minutes':
      case 'minute':
      case 'mins':
      case 'min':
      case 'm':
        return n * m;

      case 'seconds':
      case 'second':
      case 'secs':
      case 'sec':
      case 's':
        return n * s;

      case 'milliseconds':
      case 'millisecond':
      case 'msecs':
      case 'msec':
      case 'ms':
        return n;

      default:
        return undefined;
    }
  }
  /**
   * 将ms转化为短时间格式
   */


  function fmtShort(ms) {
    var msAbs = Math.abs(ms);

    if (msAbs >= d) {
      return Math.round(ms / d) + 'd';
    }

    if (msAbs >= h) {
      return Math.round(ms / h) + 'h';
    }

    if (msAbs >= m) {
      return Math.round(ms / m) + 'm';
    }

    if (msAbs >= s) {
      return Math.round(ms / s) + 's';
    }

    return ms + 'ms';
  }
  /**
   * 将ms转化为长时间格式
   */


  function fmtLong(ms) {
    var msAbs = Math.abs(ms);

    if (msAbs >= d) {
      return plural(ms, msAbs, d, 'day');
    }

    if (msAbs >= h) {
      return plural(ms, msAbs, h, 'hour');
    }

    if (msAbs >= m) {
      return plural(ms, msAbs, m, 'minute');
    }

    if (msAbs >= s) {
      return plural(ms, msAbs, s, 'second');
    }

    return ms + ' ms';
  }
  /**
   * 根据单/复数判断是否添加s
   * @param ms 转化的毫秒数
   * @param msAbs 毫秒数的绝对值
   * @param n 转化类型
   * @param name 转化后的格式名
   * @returns
   */


  function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
  }

  function index (val, options) {
    options = options || {};

    if (whichType.isTypeString(val) && val.length > 0) {
      return parse(val);
    } else if (whichType.isTypeNumber(val) && isFinite(val)) {
      return options["long"] ? fmtLong(val) : fmtShort(val);
    }

    throw new Error("字符串不能为空或者一个合法的数值，当前数值为：".concat(JSON.stringify(val)));
  }

  return index;

})));
