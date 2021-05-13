import {
    ITooltipProps
} from '../Tooltip/index';


export interface IPopoverProps extends ITooltipProps{
    content?:React.ReactNode,

}

export { default } from './Popover';