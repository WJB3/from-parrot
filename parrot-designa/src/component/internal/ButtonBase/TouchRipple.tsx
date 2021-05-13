/*
 * @Author: your name
 * @Date: 2021-01-19 16:21:50
 * @LastEditTime: 2021-01-22 19:37:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/internal/ButtonBase/TouchRipple.tsx
 */
import React, { useRef } from 'react';
import classNames from '../../../utils/classNames';
import { TransitionGroup } from 'react-transition-group';
import { TouchRippleProps } from './index';
import useNextKey from '../../../hook/useNextKey';
import Ripple from './Ripple';

const DURATION = 500;

const TouchRipple = React.forwardRef<any, TouchRippleProps>((props, ref) => {

    const {
        prefixCls: lastPrefixCls,
        component: Component = 'span',
        center: centerProp = false
    } = props;

    const prefixCls = `${lastPrefixCls}-TouchRipple`;

    const nextKey = React.useRef(0);

    const [ripples, setRipples] = React.useState([]);

    const touchRippleRef = useRef(null);

    const ignoreMouseDown = useRef(false);

    const startCommit = React.useCallback(
        params => {
            const { rippleX, rippleY, rippleSize } = params;
            setRipples(oldRipples => [
                ...oldRipples,
                <Ripple
                    prefixCls={prefixCls}
                    key={nextKey.current}
                    timeout={DURATION}
                    rippleX={rippleX}
                    rippleY={rippleY}
                    rippleSize={rippleSize}
                />
            ]);
            nextKey.current += 1;
        }
        , []
    );

    const start = React.useCallback((event = {}, options = {}) => {
        const {
            center = centerProp
        } = options;

        /** 某些手机touchstart和mousedown事件同时触发 */
        if (event.type === 'mousedown' && ignoreMouseDown.current) {
            /** 当切换为手机端时置为false */
            ignoreMouseDown.current = false;
            return;
        }

        if (event.type === 'touchstart') {
            ignoreMouseDown.current = true;
        }


        const element = touchRippleRef.current;

        const rect = element
            /**  方法返回元素的大小及其相对于视口的位置 */
            ? element.getBoundingClientRect()
            : { width: 0, height: 0, left: 0, right: 0 }

        let rippleX;/** 涟漪中心点相对于容器横坐标 */
        let rippleY;/** 涟漪中心点相对于容器纵坐标 */
        let rippleSize;

        if (center) {
            rippleX = Math.round(rect.width / 2);
            rippleY = Math.round(rect.height / 2);

            /** 半径 */
            const radius = Math.sqrt(Math.pow(rippleX, 2) + Math.pow(rippleY, 2));
            rippleSize = radius * 2;
        } else {
            const clientX = event.clientX ? event.clientX : event.touches[0].clientX;
            const clientY = event.clientY ? event.clientY : event.touches[0].clientY;
            // 相对于元素的x、y
            rippleX = Math.round(clientX - rect.left);
            rippleY = Math.round(clientY - rect.top);

            const sizeX =
            Math.max(Math.abs((element ? element.clientWidth : 0) - rippleX), rippleX);
            const sizeY =
            Math.max(Math.abs((element ? element.clientHeight : 0) - rippleY), rippleY);

            rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2) * 2;
        }

        startCommit({ rippleX, rippleY, rippleSize })

    }, [startCommit, centerProp]);

    const stop = React.useCallback((event) => {
        setRipples(oldRipples => {
            if (oldRipples.length > 0) {
                return oldRipples.slice(1);
            }
            return oldRipples;
        });
    }, []);

    React.useImperativeHandle(
        ref,
        () => ({
            start,
            stop
        }),
        [start, stop]
    )

    return (
        <Component className={classNames(prefixCls)} ref={touchRippleRef}>
            <TransitionGroup component={null} exit>
                {ripples}
            </TransitionGroup>
        </Component>
    )
}) as React.FC<TouchRippleProps>;

export default React.memo(TouchRipple);
