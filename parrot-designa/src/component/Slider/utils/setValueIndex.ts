

export default function setValueIndex({values,source,newValue,index}){
    if(source[index]===newValue){
        return source;
    }
    const output=values.slice();
    output[index]=newValue;
    return output;
}