/*
 * @Author: your name
 * @Date: 2021-01-20 13:41:16
 * @LastEditTime: 2021-01-21 13:18:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/ConfigProvider/ConfigContext.ts
 */
import React from 'react'
import {
    globalPrefix
} from '../internal/config/variable'

const ConfigContext = React.createContext({
    getPrefixCls: (suffixCls:string, customizedPrefixCls?:string) => {
        if (customizedPrefixCls) return customizedPrefixCls
        return suffixCls ? `${globalPrefix}-${suffixCls}` : globalPrefix
    }
})

export default ConfigContext
