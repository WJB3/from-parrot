/*
 * @Author: your name
 * @Date: 2021-01-20 13:40:22
 * @LastEditTime: 2021-01-28 17:52:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/ConfigProvider/ConfigProvider.tsx
 */
import React, { useContext } from 'react'
import ConfigContext from './ConfigContext'

export interface IConfigProviderProp {
    children:React.ReactNode,
    prefixCls?:string, // 自定义类名前缀
}

const ConfigProvider:React.FC<IConfigProviderProp> = props => {

    const {
        children,
        prefixCls
    } = props

    const configContext = useContext(ConfigContext)

    const getPrefixClsWrapper = (context:any) => {
        return (suffixCls:string, customizePrefixCls?:string) => {
            if (customizePrefixCls) return customizePrefixCls
            const mergePrefixCls = prefixCls || context.getPrefixCls('')
            return suffixCls ? `${mergePrefixCls}-${suffixCls}` : mergePrefixCls
        }
    }

    const config = {
        ...configContext,
        getPrefixCls: getPrefixClsWrapper(configContext)
    }

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    )
}

export default ConfigProvider
