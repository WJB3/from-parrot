/*
 * @Author: your name
 * @Date: 2021-01-20 17:52:18
 * @LastEditTime: 2021-01-22 17:23:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/BackDrop/BackDrop.tsx
 */
import React, { useContext } from 'react';
import useTransitionComponent from '../../hook/useTransitionComponent';
import {
    ConfigContext
} from '../ConfigProvider/index';
import classNames from '../../utils/classNames';
import Paper, { IPaperProps } from '../Paper/index';
import Protal from '../Portal/index';
import './index.scss';

export interface IBackDropProp {
    visible?: boolean, /** 背景板是否显示 */
    transition?: boolean | string, /** 背景板过渡效果 */
    prefixCls?: string, /** 背景板类名前缀 */
    className?: string, /** 背景板className类名 */
    center?: boolean, /** 背景板是否居中 */
    component?: string | React.FC<IPaperProps>
}
 

const Backdrop = React.forwardRef<any, IBackDropProp>((props, ref) => {

    const {
        visible: visibleProp,
        transition = 'fade',
        prefixCls: customizePrefixCls,
        component: BackdropRoot = Paper,
        className,
        children,
        center = true
    } = props;

    const TransitionComponent = useTransitionComponent(transition);

    const prefixCls = useContext(ConfigContext)?.getPrefixCls('Backdrop', customizePrefixCls);

    return (
        <Protal>
            <TransitionComponent visible={visibleProp}>
                <BackdropRoot
                    className={
                        classNames(
                            prefixCls,
                            className,
                            {
                                [`${prefixCls}-Center`]: center
                            }
                        )
                    }
                >
                    {children}
                </BackdropRoot>
            </TransitionComponent>
        </Protal>
    )
}) as React.FC<IBackDropProp>;

export default Backdrop;
