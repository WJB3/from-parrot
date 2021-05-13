/**
 * 复制多个或一个对象的属性描述符到目标对象中
 * @param destination
 * @param origins
 */
function merge(destination, ...origins) {
    if (!destination) {
        throw new TypeError('this argument destination is required');
    }
    if (!origins.length) {
        throw new TypeError('this argument origins is required');
    }
    origins.forEach(origin => {
        Object.getOwnPropertyNames(origin).forEach(name => {
            let descriptor = Object.getOwnPropertyDescriptor(origin, name);
            Object.defineProperty(destination, name, descriptor);
        });
    });
    return destination;
}
export default merge;
