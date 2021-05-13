/*
 * @Author: your name
 * @Date: 2021-02-01 09:43:15
 * @LastEditTime: 2021-02-01 13:23:09
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Slider/utils/focusThumb.ts
 */

/**
 * 聚焦thumb
 */
import ownerDocument from '../../../utils/ownerDocument';

export default function focusThumb({sliderRef,activeIndex,setActive}){
    const doc=ownerDocument(sliderRef.current);

    /** 当前获得焦点的元素 */
    if(!sliderRef.current.contains(doc.activeElement)){
        sliderRef.current.querySelector(`[role='slider-thumb'][data-index='${activeIndex}']`).focus();
    }

    if(setActive){
        setActive(activeIndex);
    }
}