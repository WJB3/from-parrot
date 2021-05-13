/*
 * @Author: your name
 * @Date: 2021-02-18 11:44:43
 * @LastEditTime: 2021-02-18 18:17:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/AlertBar/AlertBar.tsx
 */
import React, { useCallback, useContext, useMemo, useState, useRef } from 'react';
import { IAlertBarProps } from './index';
import {
    ConfigContext
} from '../ConfigProvider/index';
import classNames from '../../utils/classNames';
import Paper from '../Paper/index';
import hasValue from '../../utils/hasValue';
import capitalize from '../../utils/capitalize';
import useRect from '../../hook/useRect';
import useCallbackState from '../../hook/useCallbackState';
import {
    Warning,
    Error as ErrorIcon,
    Info,
    Success,
    WarningOutline,
    ErrorOutline,
    InfoOutline,
    SuccessOutline
} from './../Icon';
import useEventListener from '../../hook/useEventListener';
import './index.scss';
import useForkRef from '../../hook/useForkRef';

const AlertBar = React.forwardRef<any, IAlertBarProps>((props, ref) => {

    const {
        prefixCls: customizedPrefixCls,
        children,
        round,
        color,
        type,
        icon,
        scrollable,
        delay,
        speed = 50,
        wrapable = false,
    } = props;

    const prefixCls = useContext(ConfigContext)?.getPrefixCls('AlertBar', customizedPrefixCls);

    const startTimer = useRef(null);

    const contentRef = useRef(null);

    const wrapperRef = useRef(null);

    const [scrollObj, setScrollObj] = useCallbackState({
        offset: 0,
        duration: 0,
        contentWidth: 0,
        wrapWidth: 0
    });

    const AlertIcon = useMemo(() => {
        let innericon;
        switch (color) {
            case 'warning':
                innericon = type === 'outline' ? WarningOutline : Warning;
                break;
            case 'danger':
                innericon = type === 'outline' ? ErrorOutline : ErrorIcon;
                break;
            case 'info':
                innericon = type === 'outline' ? InfoOutline : Info;
                break;
            case 'success':
                innericon = type === 'outline' ? SuccessOutline : Success;
                break;
            default:
                innericon = null;
        }
        return icon ? icon : innericon;
    }, [color, type, icon]);

    const reset = useCallback((callback) => {
        setScrollObj({
            offset: 0,
            duration: 0,
            contentWidth: 0,
            wrapWidth: 0
        }, () => {
            callback()
        })
    }, []);

    const start = useCallback(() => {
        reset(() => {
            clearTimeout(startTimer.current);
            startTimer.current = setTimeout(() => { 
                console.log("---------") 
                if (!wrapperRef.current || !contentRef.current || scrollable === false) {
                    return;
                }

                const wrapRefWidth = useRect(wrapperRef).width;
                const contentRefWidth = useRect(contentRef).width;
   
                if (scrollable || contentRefWidth > wrapRefWidth) {
                    //如果滚动或者内容溢出
                    setScrollObj({
                        wrapWidth: wrapRefWidth,
                        contentWidth: contentRefWidth,
                        offset: -contentRefWidth,
                        duration: contentRefWidth / speed
                    })
                }
            }, delay ? delay : 0);
        });

    }, [scrollable, delay, speed, reset, startTimer.current]);

    useEventListener('pageshow', start);

    const handleRef = useForkRef(ref);

    const isEllipsis = useMemo(() => {
        let flag;
        if (wrapable === false && scrollable !== true && scrollObj.wrapWidth > scrollObj.contentWidth) {
            //无法换行并且没有显示设置滚动省略文本
            flag = true;
        }
        return flag;
    }, [scrollable, wrapable, scrollObj.wrapWidth, scrollObj.contentWidth]); 

    console.log('scrollObj',scrollObj)

    return (
        <Paper
            ref={handleRef}
            className={
                classNames(
                    prefixCls,
                    {
                        [`${prefixCls}-${capitalize(color)}`]: color,
                        [`${prefixCls}-Outline`]: type === 'outline',
                        [`${prefixCls}-isEllipsis`]: isEllipsis
                    }
                )
            }
            square={!hasValue(round)}
            deep={0}
        >
            {!!AlertIcon && <div className={
                classNames(
                    `${prefixCls}-Icon`
                )
            }>
                <AlertIcon />
            </div>}

            <div
                ref={wrapperRef}
                className={
                    classNames(
                        `${prefixCls}-Message`
                    )
                } 
            >
                <div 
                    ref={contentRef}  
                    style={{
                        transform: scrollObj.offset ? `translateX(${scrollObj.offset}px)` : '',
                        transitionDuration: `${scrollObj.duration}s`,
                    }}
                    role='message'
                >{children}</div>
            </div>
        </Paper>
    )


}) as React.FC<IAlertBarProps>;

export default AlertBar;