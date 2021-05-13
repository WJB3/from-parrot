/*
 * @Author: your name
 * @Date: 2021-01-27 10:36:22
 * @LastEditTime: 2021-01-28 20:25:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/utils/createChainedFunction.ts
 */
/**
 * 可以让函数依次执行
 */
export default function createChainedFunction (...list:any[]) {
    const args = Array.prototype.slice.call(arguments, 0)

    if (args.length === 1) {
        return args[0]
    }

    return function chainedFunction () {
        for (let i = 0; i < args.length; i++) {
            if (args[i] && args[i].apply) { 
                args[i].apply(this, arguments)
            }
        }
    }
}
