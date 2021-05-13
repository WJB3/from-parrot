import {
    IPopoverProps
} from '../Popover/index';

export interface IPopconfirmProps extends IPopoverProps{
    icon?:any,
    cancelButtonProps?:any,
    okButtonProps?:any,
    cancelText?:string,
    okText?:string,
    onConfirm?:Function,
    onCancel?:Function
}   

export {
    default
} from './popconfirm';