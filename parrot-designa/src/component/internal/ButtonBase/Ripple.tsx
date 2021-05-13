/*
 * @Author: your name
 * @Date: 2021-01-19 16:23:47
 * @LastEditTime: 2021-01-20 13:19:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/internal/ButtonBase/Ripple.tsx
 */
import React from 'react';
import classNames from '../../../utils/classNames';
import useEnhancedEffect from '../../../hook/useEnhancedEffect';
import noop from '../../../utils/noop';
import { RippleProps, IRippleStyle } from './index';


const Ripple: React.FC<RippleProps> = (props) => {

    const {
        prefixCls: lastPrefixCls,
        rippleSize,
        rippleX,
        rippleY,
        in: inProp,
        onExited = noop,
        timeout
    } = props;

    const prefixCls = `${lastPrefixCls}-Ripple`;

    const [leaving, setLeaving] = React.useState(false);

    const handleExited = onExited;

    const rippleClassName: string = classNames(
        prefixCls
    );

    const childClassName: string = classNames(
        `${prefixCls}-Child`,
        {
            [`${prefixCls}-ChildLeaving`]: leaving
        }
    );

    const rippleStyles: IRippleStyle = {
        width: rippleSize,
        height: rippleSize,
        top: -(rippleSize / 2) + rippleY,
        left: -(rippleSize / 2) + rippleX
    };

    useEnhancedEffect(() => {
        if (!inProp) {
            setLeaving(true)
            const timeoutId = setTimeout(handleExited, timeout);
            return () => {
                clearTimeout(timeoutId);
            };
        }
        return undefined;
    }, [inProp, timeout, handleExited]);

    return (
        <span
            style={rippleStyles}
            className={rippleClassName}
        >
            <span className={childClassName}></span>
        </span>
    )
}


export default Ripple;
