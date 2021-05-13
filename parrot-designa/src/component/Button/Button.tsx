/*
 * @Author: your name
 * @Date: 2021-01-20 14:12:23
 * @LastEditTime: 2021-01-26 15:03:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Button/Button.tsx
 */
import React, { useContext } from 'react';
import ButtonBase from '../internal/ButtonBase/index';
import classNames from '../../utils/classNames';
import Loading from '../../component/Loading/index';
import {
    ConfigContext
} from '../ConfigProvider/index';
import { IButtonProps } from './index';
import capitalize from '../../utils/capitalize';
import useDeep from '../../hook/useDeep';
import useCenter from '../../hook/useCenter';
import { ButtonGroupContext } from './context/index';


const Button = React.forwardRef<any, IButtonProps>((props, ref) => {

    const {
        prefixCls: customizePrefixCls,
        className,
        children,
        size: sizeProp = 'default',
        type: typeProp = 'landscape',
        color: colorProp = 'default',
        dashed = false,
        deep: deepProp,
        block,
        disabled,
        shape = 'round',
        center: centerProp,
        loading,
        isFirst,
        isLast,
        inGroup,
        ...restProps
    } = props;

    const prefixCls = useContext(ConfigContext)?.getPrefixCls('Button', customizePrefixCls);

    const deep = useDeep(deepProp, typeProp === 'landscape' ? 2 : 0, disabled || inGroup);
    /** react对于attribute的识别有问题 这里使用1 0 表示 */
    const center = useCenter(centerProp, shape === 'circle');

    const {
        color: colorContextValue,
        type: typeContextValue,
        size: sizeContextValue
    } = useContext(ButtonGroupContext);

    const color = colorProp && colorProp !== 'default' ? colorProp : colorContextValue || 'default';

    const type = typeProp && typeProp !== 'landscape' ? typeProp : typeContextValue || 'landscape';

    const size = sizeContextValue || sizeProp;

    return (
        <ButtonBase
            className={
                classNames(
                    prefixCls,
                    className,
                    {
                        [`${prefixCls}-Dashed`]: dashed,
                        [`${prefixCls}-${capitalize(size)}`]: size,
                        [`${prefixCls}-${capitalize(type)}`]: type,
                        [`${prefixCls}-${capitalize(color)}`]: color,
                        [`${prefixCls}-Block`]: block,
                        [`${prefixCls}-Disabled`]: disabled,
                        [`${prefixCls}-Circle`]: shape === 'circle',
                        [`${prefixCls}-Loading`]: loading,
                        [`${prefixCls}-IsFirst`]: isFirst,
                        [`${prefixCls}-IsLast`]: isLast,
                        [`${prefixCls}-IsInner`]: inGroup && !isFirst && !isLast

                    }
                )
            }
            ref={ref}
            deep={deep}
            disabled={disabled || loading}
            shape={shape}
            center={center}
            {...restProps}
        >
            {loading && <Loading size={18} loadStyle={{ marginRight: 6 }} color={color} />}
            {children}
        </ButtonBase>
    )

}) as React.FC<IButtonProps>;

export default Button;
