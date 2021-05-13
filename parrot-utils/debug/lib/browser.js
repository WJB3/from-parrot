(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@parrotjs/supports-color'), require('@parrotjs/which-type')) :
  typeof define === 'function' && define.amd ? define(['@parrotjs/supports-color', '@parrotjs/which-type'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DEBUG = factory(global.supportsColor));
}(this, (function (supportsColor) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var supportsColor__default = /*#__PURE__*/_interopDefaultLegacy(supportsColor);

  //@ts-ignore

  function setup(env) {
    Object.keys(env).forEach(function (key) {
      createDebug[key] = env[key];
    });
    /**
     * 使用给定的“命名空间”创建一个调试器。
     * @param namespace 命名空间
     */

    function createDebug(namespace) {
    }

    return createDebug;
  }

  //@ts-ignore 

  function formatArgs(args) {
    args[0] = "\n        ".concat(supportsColor__default['default'] ? '%c' : '', "\n        ").concat(this.namespace, "\n        ").concat(supportsColor__default['default'] ? ' %c' : ' ', "\n        ").concat(args[0], "\n        ").concat(supportsColor__default['default'] ? '%c ' : ' ', "\n        +").concat(this.diffTime(this.diff), "\n    ");

    if (!supportsColor__default['default']) {
      return;
    }

    var c = "color: ".concat(this.color);
    args.splice(1, 0, c, 'color:inherit');
  }

  var browser = setup({
    formatArgs: formatArgs
  });

  return browser;

})));
