import React ,{useContext,useState} from 'react';
import {
    IPopconfirmProps
} from './index';
import {
    ConfigContext
} from '../ConfigProvider';
import Poppover from '../Popover/index'; 
import { Warning } from '../Icon/index';
import Button from '../Button/index';
import Space from '../Space/index';
import './index.scss';

const Popconfirm=React.forwardRef<any, IPopconfirmProps>((props,ref)=>{

    const {
        children,
        title,
        icon:Icon=Warning,
        content, 
        prefixCls:customizedPrefixCls,
        cancelButtonProps,
        okButtonProps,
        okText='确定',
        cancelText='取消',
        onConfirm,
        onCancel,
        ...tooltipProps
    }=props;

    const prefixCls=useContext(ConfigContext)?.getPrefixCls('Popconfirm',customizedPrefixCls);

    const [okButtonRef,setOKButtonRef]=useState();
    const [cancelButtonRef,setCancelButtonRef]=useState(); 

    const popconfirmContent=(
        <div className={`${prefixCls}-Content`}>
            <div className={`${prefixCls}-Message`}>
                <Icon />
                {title}
            </div>
            <div className={`${prefixCls}-Action`}>
                <Space>
                    <Button size='small' type='text' color='danger' onClick={onCancel} {...cancelButtonProps} ref={setOKButtonRef}>
                        {cancelText}
                    </Button>
                    <Button size='small' type='text' color='primary' onClick={onConfirm} {...okButtonProps} ref={setCancelButtonRef}>
                        {okText}
                    </Button>
                </Space>
            </div>
        </div>
    ) 
 
    return (
        <Poppover  
            title={null}  
            content={popconfirmContent} 
            externalNode={[okButtonRef,cancelButtonRef]}
            trigger={'click'}
            {...tooltipProps}
        >
            {children}
        </Poppover>
    )

}) as React.FC<IPopconfirmProps>;

export default Popconfirm;