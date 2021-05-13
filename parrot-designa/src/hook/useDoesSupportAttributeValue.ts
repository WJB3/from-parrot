import React from 'react';
/**
 * 测试当前浏览器是否支持某个属性值
 * @param attribute 
 * @param value 
 */
export default function useDoesSupportAttributeValue(attribute,value){

    return React.useMemo(()=>{
        let cachedSupports;
        if(cachedSupports===undefined){
            const element=document.createElement('div');
            element.style[attribute]=value;
            document.body.appendChild(element);
            cachedSupports=window.getComputedStyle(element)[attribute]===value;
            element.parentElement.removeChild(element);
        } 
        return cachedSupports;
    },[attribute,value]);
}