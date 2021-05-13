import React,{useContext } from 'react';
import classNames from '../../utils/classNames';  
import toChildrenArray from '../../utils/toChildrenArray';
import capitalize from '../../utils/capitalize';
import {
    ConfigContext,
} from '../ConfigProvider/index';  
import {
    ISpaceProps
} from './index';
import "./index.scss"; 

const spaceSize = {
    small: 8,
    default: 16,
    large: 24,
};

const Space=React.forwardRef<any,ISpaceProps>((props,ref)=>{
    const {
        prefixCls:customizePrefixCls,
        className, 
        children,
        component:Component='div',
        orientation="horizontal", 
        itemStyle,
        size="default",
        style
    }=props;

    const prefixCls = useContext(ConfigContext)?.getPrefixCls("Space", customizePrefixCls);

    const items=toChildrenArray(children);

    return (
        <Component ref={ref} style={style} className={classNames(
            prefixCls,className,
            orientation?`${prefixCls}-${capitalize(orientation)}`:`${prefixCls}-Horizontal`,
        )}>
            {
                items.map((child,i)=>(
                    <div 
                        className={`${prefixCls}-Item`}
                        key={`${prefixCls}-Item-${i}`}
                        style={
                            i === items.length - 1
                              ? {...itemStyle}
                              : {
                                  [orientation === 'vertical' ? 'marginBottom' : 'marginRight']:
                                    typeof size === 'string' ? spaceSize[size] : size,
                                    ...itemStyle
                                }
                        }
                        
                    >
                        {child}     
                    </div>
                ))
            }
        </Component>
    )
}) as React.FC<ISpaceProps>;
 
export default Space;