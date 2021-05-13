/*
 * @Author: your name
 * @Date: 2021-01-20 14:18:15
 * @LastEditTime: 2021-01-21 13:28:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Loading/Loading.tsx
 */
import React, { useContext } from 'react';
import classNames from '../../utils/classNames';
import {
    ConfigContext
} from '../ConfigProvider/index';
import capitalize from '../../utils/capitalize';
import Paper from '../../component/Paper';
import './index.scss';

export interface ILoadingProps{
    prefixCls?:string, // 类名前缀
    className?:string, // 传入的类名
    color?:string, // 加载提示器的颜色
    children?:React.ReactNode, // 孩子节点
    size?:number, // 加载提示器的大小
    loadStyle?:React.CSSProperties, // 加载提示器的自定义样式
    loadThickness?:number, // 加载指示器的宽度
}

const Loading:React.FC<ILoadingProps> = props => {

    const SIZE:number = 44;

    const {
        className,
        prefixCls: customizePrefixCls,
        color = 'primary',
        size = 40,
        loadStyle,
        loadThickness = 4.3
    } = props;

    const prefixCls = useContext(ConfigContext)?.getPrefixCls('Loading', customizePrefixCls);

    const LOADING_NODE = (
        <Paper className={classNames(className, prefixCls)} style={{ width: size, height: size, ...loadStyle }} deep={0}>
            <svg className={classNames(`${prefixCls}-Svg`)} viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}>
                <circle
                    className={
                        classNames(
                            `${prefixCls}-Circle`,
                            `${prefixCls}-Indeterminate`,
                            {
                                [`${prefixCls}-${capitalize(color)}`]: color
                            }
                        )
                    }
                    cx={SIZE}
                    cy={SIZE}
                    r={(SIZE - loadThickness) / 2}
                    fill="none"
                    strokeWidth={loadThickness}
                />
            </svg>
        </Paper>
    );

    return LOADING_NODE;

}

export default Loading;
