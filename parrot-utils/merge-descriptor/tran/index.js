/**
 * 复制多个或一个对象的属性描述符到目标对象中
 * @param destination
 * @param origins
 */
function merge(destination) {
  if (!destination) {
    throw new TypeError('this argument destination is required');
  }

  for (var _len = arguments.length, origins = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    origins[_key - 1] = arguments[_key];
  }

  if (!origins.length) {
    throw new TypeError('this argument origins is required');
  }

  origins.forEach(function (origin) {
    Object.getOwnPropertyNames(origin).forEach(function (name) {
      var descriptor = Object.getOwnPropertyDescriptor(origin, name);
      Object.defineProperty(destination, name, descriptor);
    });
  });
  return destination;
}

export default merge;