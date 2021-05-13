/*
 * @Author: your name
 * @Date: 2021-01-25 09:54:23
 * @LastEditTime: 2021-01-28 10:23:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Button/context/ButtonGroupContext.ts
 */
import React from 'react';

export interface IContextProps {
    color?:any;
    type?:any;
    size?:any;
}

export default React.createContext<IContextProps>({});
