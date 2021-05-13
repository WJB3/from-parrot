(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.NOOP = factory());
}(this, (function () { 'use strict';

	/**
	 * 一个空函数
	 */
	var index = (function () {});

	return index;

})));
