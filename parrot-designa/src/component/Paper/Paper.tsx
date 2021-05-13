/*
 * @Author: your name
 * @Date: 2021-01-21 18:12:56
 * @LastEditTime: 2021-01-28 10:25:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Paper/Paper.tsx
 */
import React, { useContext } from 'react';
import classNames from '../../utils/classNames';
import {
    ConfigContext
} from '../ConfigProvider/index';
import './index.scss';
import { IPaperProps } from './index';


const Paper = React.forwardRef<any, IPaperProps>((props, ref) => {

    const {
        prefixCls: customizePrefixCls,
        component: Component = 'div',
        className,
        square = false,
        children,
        deep = 1,
        shape = 'round',
        style,
        transparent,
        inline,
        onMouseEnter,
        onMouseLeave,
        ...restProps
    } = props; 

    const prefixCls = useContext(ConfigContext)?.getPrefixCls('Paper', customizePrefixCls);

    return (
        <Component
            className={
                classNames(
                    prefixCls,
                    className,
                    {
                        [`${prefixCls}-Round`]: !square && shape === 'round',
                        [`${prefixCls}-Deep-${deep}`]: deep,
                        [`${prefixCls}-Circle`]: !square && shape === 'circle',
                        [`${prefixCls}-Transparent`]:transparent,
                        [`${prefixCls}-Inline`]:inline
                    }
                )
            }
            ref={ref}
            style={style}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...restProps}
        >
            {children}
        </Component>
    )

}) as React.FC<IPaperProps>;

export default Paper;
