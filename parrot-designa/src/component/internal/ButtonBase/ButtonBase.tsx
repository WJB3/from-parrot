/*
 * @Author: your name
 * @Date: 2021-01-19 10:27:55
 * @LastEditTime: 2021-01-22 19:35:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/internal/ButtonBase/ButtonBase.tsx
 */
import React, { useContext, useCallback, useRef } from 'react';
import classNames from '../../../utils/classNames';
import {
    ConfigContext
} from '../../ConfigProvider/index';
import { ButtonBaseProps } from './index';
import useRippleHandler from './hooks/useRippleHandler';
import useDisableHandler from '../../../hook/useDisableHandler';
import TouchRipple from './TouchRipple';
import Paper from '../../Paper/index';
import './index.scss';


const ButtonBase = React.forwardRef<any, ButtonBaseProps>((props, ref) => {

    const {
        component = 'button',
        className,
        /** 禁用disabled则无法触发点击事件，disableRipple仅仅是禁用涟漪特效 */
        disabled = false,
        disableRipple = false,
        tabIndex = 0,
        style,
        prefixCls: customizePrefixCls,
        children,
        onClick,
        onMouseDown,
        onMouseUp,
        onMouseLeave,
        onTouchStart,
        onTouchEnd,
        onTouchMove,
        onFocus,
        onBlur,
        onKeyUp,
        onKeyDown,
        center,
        ...restProps
    } = props;

    const prefixCls = useContext(ConfigContext)?.getPrefixCls('ButtonBase', customizePrefixCls);

    const rippleNodeRef = useRef(null);

    /** 点击事件 */
    const handleClick = useCallback((e) => {
        if (!disabled) {
            onClick?.(e)
        }
    }, [onClick, disabled]);

    /** 焦点事件 */
    const handleFocus = useDisableHandler(onFocus, disabled);

    /** 离开焦点 */
    const handleBlur = useDisableHandler(onBlur, disabled);

    const handleKeyDown = useDisableHandler(onKeyDown, disabled);

    const handleKeyUp = useDisableHandler(onKeyUp, disabled);

    /** pc事件 */
    const handleMouseDown = useRippleHandler('start', onMouseDown, rippleNodeRef, disabled, disableRipple);
    const handleMouseUp = useRippleHandler('stop', onMouseUp, rippleNodeRef, disabled, disableRipple);
    const handleMouseLeave = useRippleHandler('stop', onMouseLeave, rippleNodeRef, disabled, disableRipple);

    /** mobile事件 */
    const handleTouchStart = useRippleHandler('start', onTouchStart, rippleNodeRef, disabled, disableRipple);
    /** 移动端长按不会触发touchend事件 所以长按时会保留一个元素 可使用touchcancel事件进行自定义处理 */
    const handleTouchEnd = useRippleHandler('stop', onTouchEnd, rippleNodeRef, disabled, disableRipple);
    const handleTouchMove = useRippleHandler('stop', onTouchMove, rippleNodeRef, disabled, disableRipple);

    return (
        <Paper
            component='button'
            tabIndex={disabled ? -1 : tabIndex}
            className={
                classNames(
                    prefixCls,
                    className
                )
            }
            ref={ref}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            style={style}
            center={center}
            {...restProps}
        >
            {children}
            {!disableRipple && !disabled && <TouchRipple prefixCls={prefixCls} ref={rippleNodeRef} center={center} />}
        </Paper>
    )
}) as React.FC<ButtonBaseProps>;

export default ButtonBase;
