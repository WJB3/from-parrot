import React ,{useContext} from 'react';
import {
    IPopoverProps
} from './index';
import {
    ConfigContext
} from '../ConfigProvider';
import Tooltip from '../Tooltip/index';
import Border from '../internal/Border/index';
import './index.scss';


const Popover=React.forwardRef<any, IPopoverProps>((props,ref)=>{

    const {
        children,
        title,
        content,
        mode='popover',
        prefixCls:customizedPrefixCls, 
        ...tooltipProps
    }=props;

    const prefixCls=useContext(ConfigContext)?.getPrefixCls('Popover',customizedPrefixCls);

    const popoverTitle=(
        <div className={`${prefixCls}-Title`}>
            {title} 
        </div>
    )

    const popoverContent=(
        <div className={`${prefixCls}-Content`}>
            {content}
        </div>
    )

    const tooltipTitle=(
        <>
            {title && <>{popoverTitle}<Border /></>}
            {content && popoverContent}
        </>
    )

    return (
        <Tooltip mode={mode} orientation={'top'} title={tooltipTitle} {...tooltipProps}>
            {children}
        </Tooltip>
    )

}) as React.FC<IPopoverProps>;

export default Popover;