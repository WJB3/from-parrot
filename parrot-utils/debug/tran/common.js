//@ts-ignore
import { isTypeString } from '@parrotjs/which-type';

function setup(env) {
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  /**
   * 使用给定的“命名空间”创建一个调试器。
   * @param namespace 命名空间
   */

  function createDebug(namespace) {
    var prevTime;

    function debug() {
      var self = debug;
      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime || curr;
      self.curr = curr;
      prevTime = curr;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (isTypeString(args[0])) {
        // Anything else let's inspect with %O
        args.unshift('%O');
      }

      createDebug.formatArgs.call(self, args);
      var logFn = createDebug.log || console.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
  }

  return createDebug;
}

export default setup;