import React,{
    useContext,
    useCallback,
    useRef,
    useState
} from 'react';
import { ISliderProps } from './index';
import classNames from '../../utils/classNames';
import {
    ConfigContext
} from '../ConfigProvider/index';
import Rail from './Rail';
import Track from './Track';
import capitalize from '../../utils/capitalize';
import useMarks from './hook/useMarks';
import valueToPercent from './utils/valueToPercent';
import percentToValue from './utils/percentToValue';
import roundValueToStep from './utils/roundValueToStep';
import setValueIndex from './utils/setValueIndex';
import Mark from './Mark';
import MarkLabel from './MarkLabel';
import useRange from './hook/useRange';
import useOffset,{orientationProps} from './hook/useOffset';
import ValueLabel from './ValueLabel';
import findClosest from './utils/findClosest';
import focusThumb from './utils/focusThumb';
import Thumb from './Thumb';
import {
    MOUSE_BUTTON_CODE
} from '../../utils/MouseButton';
import useFingerOrMousePosition from '../../hook/useFingerOrMousePosition';
import useForkRef from '../../hook/useForkRef';
import ownerDocument from '../../utils/ownerDocument';
import clampBetween from '../../utils/clampBetween';
import asc from '../../utils/asc';
import useEnhancedEffect from '../../hook/useEnhancedEffect';
import useDoesSupportAttributeValue from '../../hook/useDoesSupportAttributeValue'
import useIsFocusVisible from '../../hook/useIsFocusVisible';
import './index.scss';
 
const Forward = ({ children }) => children;

const Slider=React.forwardRef<any,ISliderProps>((props,ref)=>{

    const {
        prefixCls:customizedPrefixCls,
        orientation='horizontal',
        marks:marksProp,
        step=1,
        min,
        max,
        track='normal',
        value:valueProp,
        defaultValue,
        valueLabelDisplay='off',
        style,
        onMouseDown,
        onChange,
        onChangeCommitted,
        disabled,
        color='minor'
    }=props;

    /** 记录唯一touch Id */
    const touchId=useRef();

    /** sliderRef */
    const sliderRef = React.useRef(); 

    const isSupportTouchActionNone=useDoesSupportAttributeValue('touchAction','none');

    const {
        isFocusVisible,
        onBlur:handleBlurVisible, 
        ref: focusVisibleRef,
    }=useIsFocusVisible();

    /** 主要是展示当前的thumb */
    const [active,setActive]=useState(-1);

    /** 主要控制label提示框 */
    const [open,setOpen]=useState(-1);

    const prefixCls=useContext(ConfigContext)?.getPrefixCls('Slider',customizedPrefixCls);

    const [values,setValue,valueDerived]=useRange({value:valueProp,defaultValue,min,max});

    const [focusVisible, setFocusVisible] = React.useState(-1);

    const [marks,marked]=useMarks({marksProp,step,min,max});  

    const [ trackStyle ]=useOffset(values,min,max,orientation);

    const handleRef=useForkRef(sliderRef,focusVisibleRef,ref);

    /** 得出新值 */
    const getFingerNewValue=React.useCallback(({finger,move=false,values:values2,source})=>{
        const {current:slider}=sliderRef;

        const {width,height,bottom,left}=(slider as any).getBoundingClientRect();

        let percent;

        if(orientation.indexOf('vertical')===0){
            /** 垂直时得出顶部距离手指的百分比 */
            percent=(bottom-finger.y)/height;
        }else{
            percent=(finger.x-left)/width;
        }

        let newValue=percentToValue(percent,min,max); 

        if(step){
            /** 如果有step跟有规律的跳 */
            newValue=roundValueToStep(newValue,step,min);
        }else{
            /** 如果没有就跳到最近的mark点 */
            const marksValues = marks.map((mark) => mark.value); 
            const closestIndex=findClosest(marksValues,newValue); 
            newValue=marksValues[closestIndex];
        } 

        newValue=clampBetween(newValue,min,max);

      

        let activeIndex = 0; 

        return { newValue,activeIndex } 

    },[sliderRef.current,orientation,step,marks]);

    const handleTouchMove=useCallback((nativeEvent)=>{  

        const finger=useFingerOrMousePosition(nativeEvent,touchId);

        const {newValue,activeIndex}=getFingerNewValue({
            finger,
            move:true,
            values,
            source:valueDerived
        });

        focusThumb({sliderRef,activeIndex,setActive});
        
        setValue(newValue);

        onChange?.(newValue,nativeEvent);

    },[values,valueDerived,focusThumb,setActive,setValue]);

    const handleTouchEnd=useCallback((nativeEvent)=>{
        const finger=useFingerOrMousePosition(nativeEvent,touchId);

        if(!finger){
            return ;
        }

        const {newValue} =getFingerNewValue({finger,values,source:valueDerived})

        setActive(-1);

        if (nativeEvent.type === 'touchend') {
            setOpen(-1);
        }

        if(onChangeCommitted){
            onChangeCommitted(nativeEvent,newValue);
        }
        /** 手指放开或者鼠标放开时将唯一touchid置空 */
        touchId.current=undefined;

        stopListening();
 
    },[values,valueDerived,setActive,setOpen,onChangeCommitted]);

    const handleTouchStart=useCallback((event)=>{
        /** 如果浏览器不支持，我们需要自己手动阻止页面跳转 */
        if(!isSupportTouchActionNone){
            event.preventDefault();
        }
        const touch = event.changedTouches[0];
        /** 在触摸会话中唯一标识当前手指的数字 */
        if(touch!=null){
            touchId.current=touch.identifier;
        }
        const finger=useFingerOrMousePosition(event,touchId);

        const { 
            newValue,
            activeIndex
        }=getFingerNewValue({finger,values,source:valueDerived});

        focusThumb({sliderRef,activeIndex,setActive});  

        setValue(newValue);

        onChange?.(newValue,event);

        const doc = ownerDocument(sliderRef.current);

        doc.addEventListener('touchmove',handleTouchMove);
        doc.addEventListener('touchend',handleTouchEnd);

    },[isSupportTouchActionNone,valueDerived,setActive,handleTouchMove,handleTouchEnd]);

    const stopListening=React.useCallback(()=>{

        const doc=ownerDocument(sliderRef.current);
        doc.removeEventListener('mousemove',handleTouchMove);
        doc.removeEventListener('mouseup',handleTouchEnd);
        doc.removeEventListener('touchmove',handleTouchMove);
        doc.removeEventListener('touchend',handleTouchEnd);

    },[handleTouchEnd,handleTouchMove]);

    useEnhancedEffect(()=>{
        const { current: slider } = sliderRef;
        (slider as any).addEventListener('touchstart',handleTouchStart,{
            /**
             * passive: if true, 意味着listener永远不远调用preventDefault方法，
             * 如果又确实调用了的话，浏览器只会console一个warning，而不会真的去
             * 执行preventDefault方法。根据规范，默认值为false. 但是chrome,
             *  Firefox等浏览器为了保证滚动时的性能，在document-level nodes(Window,
             *  Document, Document.body)上针对touchstart和touchmove事件将passive默认值改
             * 为了true， 保证了在页面滚动时不会因为自定义事件中调用了preventDefault而阻塞页面渲染。
             * 
             * 这里我们在不支持touch-action:none时 会触发event.preventDefault阻止浏览器默认滚动行为
             */
            passive:isSupportTouchActionNone
        });
        return ()=>{
            (slider as any).removeEventListener('touchstart',handleTouchStart,{
                passive:isSupportTouchActionNone
            });
            stopListening();
        }
    },[stopListening,handleTouchStart,isSupportTouchActionNone]);

    const handleMouseDown=useCallback((event)=>{ 
 
        onMouseDown?.(event);

        /** 仅有点击左健才有反应 */
        if(event.button!==MOUSE_BUTTON_CODE.LEFT_CLICK){
            return ;
        }
        /** 阻止默认行为会导致子元素的onFocus事件无法触发 */
        event.preventDefault();

        const finger=useFingerOrMousePosition(event,touchId); 

        const { newValue,activeIndex }=getFingerNewValue({finger,values,source:valueDerived})

        /** 手动触发聚焦事件 */
        focusThumb({sliderRef,activeIndex,setActive});

        setValue(newValue);

        onChange?.(newValue,event);

        const doc=ownerDocument(sliderRef.current);

        doc.addEventListener('mousemove',handleTouchMove);

        doc.addEventListener('mouseup',handleTouchEnd);

    },[onMouseDown,getFingerNewValue,setActive,onChange]);

    /** 鼠标经过时自身触发事件 */
    const handleMouseOver=useCallback((event)=>{
        /** event.currentTarget指向事件所绑定的元素 */
        const index=Number(event.currentTarget.getAttribute('data-index'));
        setOpen(index);
    },[setOpen]);

    /** 鼠标离开元素 */
    const handleMouseLeave=useCallback((event)=>{
        setOpen(-1);
    },[setOpen]);

    const handleFocus=useCallback((event)=>{ 
        const index = Number(event.currentTarget.getAttribute('data-index'));    
        if (isFocusVisible(event)) {
            setFocusVisible(index);
        } 
    },[setOpen,isFocusVisible]);

    const handleBlur=useCallback((event)=>{
        handleBlurVisible();
        if (!isFocusVisible(event)) {
            setFocusVisible(-1);
        }
        setOpen(-1);
    },[setOpen,isFocusVisible]);

    useEnhancedEffect(()=>{
        if(!disabled){
            stopListening();
        }
    },[disabled,stopListening]);
  
    return (
        <span
            style={style}
            // onMouseDown={handleMouseDown}
            ref={handleRef}
            className={classNames(
                prefixCls,
                {
                    [`${prefixCls}-${capitalize(orientation)}`]:orientation,
                    [`${prefixCls}-TrackFalse`]:track===false,
                    [`${prefixCls}-${capitalize(color)}`]:color
                }
            )} 
            onMouseDown={handleMouseDown}
        >
            <Rail 
                prefixCls={prefixCls}
            />
            <Track 
                prefixCls={prefixCls} 
                style={{...trackStyle}}
            />
            <input value={values.join(',')}  type="hidden" />
            {
                marks.map((mark,index)=>{
                    const percent=valueToPercent(mark.value,min,max);
                    const style=orientationProps[orientation].offset(percent);

                    let markActive;
                    if(track===false){
                        markActive=values.indexOf(mark.value)!==-1;
                    }else{
                        markActive=mark.value <= values[0]
                    }

                    return (
                        <React.Fragment key={mark.value}>
                            <Mark 
                                data-index={index}
                                prefixCls={prefixCls}
                                style={style}
                                markActive={markActive}
                            />
                            {mark.label!=null?(
                                <MarkLabel 
                                    prefixCls={prefixCls}
                                    style={style}
                                >
                                    {mark.label}
                                </MarkLabel>
                            ):null}
                        </React.Fragment>
                    )
                    
                })
            }
            {
                values.map((value,index)=>{
                    const precent=valueToPercent(value,min,max);

                    const style=orientationProps[orientation].offset(precent);
           
                    const ValueLabelComponent=valueLabelDisplay==='off'?Forward:ValueLabel; 
                   
                    return (
                        <React.Fragment key={index}>
                            <ValueLabelComponent
                                prefixCls={prefixCls}
                                value={value}
                                open={open===index||active===index||valueLabelDisplay==='on'}
                            >
                                <Thumb 
                                    prefixCls={prefixCls}
                                    style={{...style}}
                                    tabIndex={disabled ? null : 0}
                                    role="slider-thumb"
                                    dataIndex={index}
                                    className={classNames(
                                        {
                                            [`${prefixCls}-Thumb-FocusVisible`]:focusVisible===index,
                                            [`${prefixCls}-Thumb-Active`]:active===index
                                        } 
                                    )}
                                    onMouseOver={handleMouseOver}
                                    onMouseLeave={handleMouseLeave}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />  
                            </ValueLabelComponent>
                        </React.Fragment>
                    )

                })
            }
        </span>
    )
}) as React.FC<ISliderProps>;

export default Slider;