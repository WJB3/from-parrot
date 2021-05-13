import React ,{useContext} from 'react'; 
import {
    ConfigContext
} from '../../ConfigProvider/index';
import classNames from '../../../utils/classNames'; 
import {
    IParrotIconProps
} from './index';
import { generate } from '../utils';

const ParrotIcon=React.forwardRef<any,IParrotIconProps>((props,ref)=>{

    const {
        onClick,
        className,
        icon:target,
        rotate,
        prefixCls:customizePrefixCls, 
        spin,
        style
    }=props;
 
    const prefixCls=useContext(ConfigContext)?.getPrefixCls("Icon",customizePrefixCls); 

    const svgStyle=rotate?{msTransform:`rotate(${rotate}deg)`,transform:`rotate(${rotate}deg)`}:undefined; 
 

    const renderIcon=()=>{
         
        return generate(target.icon,`svg-${target.name}m`,{  
            style:svgStyle,
            width:'1em',
            height:'1em',
            className:classNames(
                {
                    [`${prefixCls}-Spin`]:!!spin
                }
            ),
            fill:"currentColor",
        })
    }
 
    return (
        <span
            ref={ref}
            onClick={onClick}
            style={style}
            className={classNames(
                prefixCls,
                className
            )}
        >
            {
                renderIcon() 
            }
        </span>
    )
}) as React.FC<IParrotIconProps>;


export default ParrotIcon;