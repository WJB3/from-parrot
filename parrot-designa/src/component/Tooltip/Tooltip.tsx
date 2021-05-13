/*
 * @Author: your name
 * @Date: 2021-01-26 16:13:00
 * @LastEditTime: 2021-01-29 13:27:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Tooltip/Tooltip.tsx
 */
import React, { useCallback, useContext, useRef } from 'react';
import Popper from '../Popper/index';
import useControlled from '../../hook/useControlled';
import useTransitionComponent from '../../hook/useTransitionComponent';
import { ConfigContext } from '../../component/ConfigProvider/index';
import { ITooltipProps } from './index';
import Paper from '../Paper/index';
import capitalize from '../../utils/capitalize';
import classNames from '../../utils/classNames';
import useForkRef from '../../hook/useForkRef';
import useTrigger from '../../hook/useTrigger';
import ClickAwayListener from '../internal/ClickAwayListener/index';
import hasFieldValue from '../../utils/hasFieldValue';
import useEnhancedEffect from '../../hook/useEnhancedEffect';
import noop from '../../utils/noop';
import './index.scss';


const Tooltip = React.forwardRef<any, ITooltipProps>((props, ref) => {

    const {
        children,
        visible: visibleProp,
        defaultVisible,
        title,
        transition='grow',
        TransitionProps,
        prefixCls: customizePrefixCls,
        orientation,
        trigger = ['hover', 'touch'],
        enterDelay = 100,
        leaveDelay = 100,
        enterTouchDelay = 500,
        leaveTouchDelay = 0,
        onChange,
        color = 'default',
        onVisibleChange,
        autoAdjustOverflow = true,
        destroyTooltipOnHide = false,
        arrow,
        mode,
        externalNode
    } = props;

    const prefixCls = useContext(ConfigContext)?.getPrefixCls('Tooltip', customizePrefixCls);

    const [childNode, setChildNode] = React.useState(); 
    /** 箭头 */
    const [arrowRef, setArrowRef] = React.useState(null);

    /** 控制显示的定时器 */
    const openTimer = useRef(null);

    /** 控制隐藏的定时器 */
    const closeTimer = useRef(null);

    /** 由于mouse*事件在移动端专门为鼠标设计的，而mouseover/out等事件则会被手指的点击所触发 且touchstart事件先于mouseover事件触发 */
    const ignoreNonTouchEvents = useRef(false);

    const watchTouchStart = React.useCallback((event) => {
        ignoreNonTouchEvents.current = true;
        const childrenProps = children.props;
        if (childrenProps.onTouchStart) {
            childrenProps.onTouchStart(event);
        }
    }, [ignoreNonTouchEvents]);

    const handleRef = useForkRef((children as any).ref, ref, setChildNode);

    const TransitionComponent = useTransitionComponent(transition);

    const [visible, setVisible] = useControlled({
        default: defaultVisible,
        controlled: visibleProp
    });

    const childrenProps = {
        ...children.props,
        /** 为了使区分移动端pc端 */
        onTouchStart: watchTouchStart,
        /** 必须要是一个引用相同的函数 */
        ref: handleRef,
    };

    const handleOpen = React.useCallback((event) => {
        /** touchstart时过滤mouse鼠标事件 */
        if (ignoreNonTouchEvents.current && event.type !== 'touchstart') {
            return;
        }
        setVisible(true);
        onChange?.(true, event);
    }, [onChange, visible]);

    const handleClose = React.useCallback((event) => {
        clearTimeout(openTimer.current);
        clearTimeout(closeTimer.current);

        setVisible(false);
        onChange?.(false, event);

    }, [onChange])

    const handleEnter = React.useCallback((event) => {
        /** 如果存在关闭定时器则清除 */
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
        }
        /**触摸事件单独处理 */
        if (enterDelay && event.type !== 'ontouchstart') {
            openTimer.current = setTimeout(() => {
                handleOpen(event);
            }, enterDelay);
        } else {
            handleOpen(event)
        }
    }, [enterDelay, handleOpen])

    const handleLeave = React.useCallback((event) => {
        /**触摸事件单独处理 */
        if (leaveDelay && event.type !== 'ontouchend') {
            clearTimeout(openTimer.current);
            closeTimer.current = setTimeout(() => {
                handleClose(event);
            }, leaveDelay)
        } else {
            handleClose(event)
        }
    }, [leaveDelay, handleClose])

    const handleMouseOver = handleEnter;
    const handleMouseLeave = handleLeave;
    const handleFocus = handleEnter;
    const handleBlur = handleLeave;

    const handleTouchStart = React.useCallback((event) => {
        watchTouchStart(event);
        openTimer.current = setTimeout(() => {
            handleEnter(event);
        }, enterTouchDelay || enterDelay);
    }, [openTimer.current, enterTouchDelay, enterDelay, watchTouchStart]);

    const handleTouchEnd = React.useCallback((event) => {
        /** 触摸离开时清除开始定时器 */
        clearTimeout(openTimer.current);
        closeTimer.current = setTimeout(() => {
            handleClose(event);
        }, leaveTouchDelay || leaveDelay)
    }, [openTimer.current, leaveTouchDelay, leaveDelay]);

    const handleVisible = React.useCallback((event) => {
        if (visible) {
            handleClose(event)
        } else {
            handleOpen(event)
        }
    }, [visible]);

    const handleContextMenu = React.useCallback((event) => {
        handleOpen(event);
    }, [visible]);

    const handleContextMenuClickAway = React.useCallback((event) => {
        if (hasFieldValue('contextMenu', trigger)) {
            handleClose(event);
        }
    }, [trigger]);

    const handleClickAway = React.useCallback((event) => {  
        /** 如果点击本元素 使其失效 */ 
        if(event.target===childNode){
            return ;
        }
        if (hasFieldValue('click', trigger)||hasFieldValue('touch', trigger)) {
            handleClose(event);
        }
    }, [trigger,childNode]);

    const eventHandler = useTrigger(
        trigger,
        {
            handleMouseOver,
            handleMouseLeave,
            handleTouchStart,
            handleTouchEnd,
            handleFocus,
            handleBlur,
            handleClick: handleVisible,
            handleContextMenu
        },
        childrenProps
    );

    useEnhancedEffect(() => {
        onVisibleChange?.(visible)
    }, [visible]);

    const handlePopperMouseEnter = useCallback(() => {
        if (closeTimer.current) {
            /** 如果存在关闭定时器则清楚 */
            clearTimeout(closeTimer.current);
        }
    }, [closeTimer.current]);

    const handlePopperMouseLeave = handleLeave;

    const noAdjustOverflow = React.useMemo(() => {
        if (!autoAdjustOverflow) {
            return {
                disablePreventOverflow: true,
                disableFlip: true
            }
        }
        return {};
    }, [autoAdjustOverflow]);
 

    return (
        <React.Fragment>
            <ClickAwayListener onClickAway={handleContextMenuClickAway}>
                {React.cloneElement(children, {
                    ...childrenProps,
                    ...eventHandler
                })}
            </ClickAwayListener>
            <Popper
                className={`${prefixCls}-popper`}
                visible={visible}
                transition={transition !== false}
                target={childNode}
                orientation={orientation}
                keepMounted={!destroyTooltipOnHide}
                arrowRef={arrowRef} 
                {...noAdjustOverflow}
            >
                {({ orientation: orientationInner, TransitionProps: TransitionPropsInner }) => {
                    return (
                        <ClickAwayListener onClickAway={handleClickAway} externalNode={externalNode}>
                            <TransitionComponent
                                {...TransitionPropsInner}
                                {...TransitionProps}
                            >
                                <Paper
                                    transparent
                                    className={
                                        classNames(
                                            prefixCls, 
                                            {
                                                [`${prefixCls}-Orientation${capitalize(orientationInner.split('-')[0])}`]: orientationInner,
                                                [`${prefixCls}-${capitalize(color)}`]: color,
                                                [`${prefixCls}-Tooltip`]:mode!=='popover'&&mode!=='popconfirm',
                                                [`${prefixCls}-Popover`]:mode==='popover',
                                                [`${prefixCls}-Popover`]:mode==='popconfirm',
                                            }
                                        )
                                    }
                                    onMouseEnter={hasFieldValue('hover', trigger) ? handlePopperMouseEnter : noop}
                                    onMouseLeave={hasFieldValue('hover', trigger) ? handlePopperMouseLeave : noop}
                                >
                                    {title}
                                    {arrow ? <span className={classNames(
                                        `arrow`
                                    )} ref={setArrowRef} /> : null}
                                </Paper>
                            </TransitionComponent>
                        </ClickAwayListener>
                    )
                }}
            </Popper>
        </React.Fragment>
    )
}) as React.FC<ITooltipProps>;

export default Tooltip;