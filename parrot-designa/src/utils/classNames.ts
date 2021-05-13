/*
 * @Author: your name
 * @Date: 2021-01-19 10:30:31
 * @LastEditTime: 2021-01-21 13:44:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/utils/classNames.ts
 */
export default function classNames (...list:any[]): string {

    const classes: string[] = []
    for (let i = 0; i < arguments.length; i++) {
        const argValue = arguments[i]
        if (!argValue) continue
        const argType = typeof argValue
        if (argType === 'string' || argType === 'number') {
            classes.push(argValue)
        } else if (Array.isArray(argValue) && argValue.length) {
            const inner = classNames.apply(null, argValue)
            if (inner) {
                classes.push(inner)
            }
        } else if (argType === 'object') {
            for (const key in argValue) {
                if (argValue[key]) {
                    classes.push(key)
                }
            }
        }
    }
    return classes.join(' ')
}
