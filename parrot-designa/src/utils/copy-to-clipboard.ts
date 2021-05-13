const  clipboardToIE11Formatting = {
    "text/plain": "Text",
    "text/html": "Url",
    "default": "Text"
}

function deselectCurrent(){
    /** 表示文档中当前被选择的文本 */
    let selection=document.getSelection();

    /** 一个返回选区(selection)中range对象数量的只读属性 */
    if(!selection.rangeCount){
        return function(){};
    }

    let active=document.activeElement;

    let ranges=[];
    for(let i=0;i<selection.rangeCount;i++){
        ranges.push(selection.getRangeAt(i));
    }

    switch (active.tagName.toUpperCase()) {
        case 'INPUT':
        case 'TEXTAREA':
            (active as any).blur();
            break;
        default:
            active=null;
            break;
    }

    selection.removeAllRanges();

    return function(){
        selection.type==='Caret' && 
        selection.removeAllRanges();

        if (!selection.rangeCount) {
            ranges.forEach(function(range) {
              selection.addRange(range);
            });
        }

        active &&
            (active as any).focus();
      
    };

}

export default function copy(text,options){
    let reselectPrevious,
        range,
        selection,
        mark,
        success=false;
    
    if(!options){
        options={}
    }
    try{
        reselectPrevious=deselectCurrent();
        /** range对象，代表一个连续的选中区域。 */
        range=document.createRange();
        /** 首先，一个可编辑的区域，用户在操作时，是通过selection对象来进行操作的。当你选中一块区域，或者光标聚焦一个点时，都会创建一个selection对象。这时候，你可以通过document.getSelection()来取得这时候创建的对象 */
        selection=document.getSelection();

        mark = document.createElement('span');
        mark.textContent=text;
        mark.style.all='unset';
        /** 防止滚动 */
        mark.style.position='fixed';
        mark.style.top=0;
        mark.style.clip='rect(0,0,0,0)';
        /** pre空白会被浏览器保留 */
        mark.style.whiteSpace='pre';
        mark.style.webkitUserSelect='text';
        mark.style.MozUserSelect='text';
        mark.style.msUserSelect='text';
        mark.style.userSelect='text';

        mark.addEventListener('copy',function(e){
            e.stopPropagation();

            if (options.format) {
                e.preventDefault();
                if(typeof e.clipboardData==='undefined'){//IE11
                    (window as any).clipboardData.clearData();
                    let format = clipboardToIE11Formatting[options.format] || clipboardToIE11Formatting['default'];
                    (window as any).clipboardData.setData(format, text);
                }else{// all other browsers
                    e.clipboardData.clearData();
                    e.clipboardData.setData(options.format, text);
                }
            }

            if(options.onCopy){
                e.preventDefault();
                options.onCopy(e.clipboardData);
            }
        })

        document.body.appendChild(mark);
        /** 这个方法主要用于将range包含在某个特定node节点内，但是不包含node,只包含node 节点内的内容 */
        range.selectNodeContents(mark);

        selection.addRange(range);
        /** 将当前选中区复制到剪切板 execCommand可能会被废弃 */
        var successful = document.execCommand("copy");

        if(!successful){
            throw new Error('copy command was unsuccessful');
        }
        success=true;

    }catch(err){
        try{
            /** 给剪贴板赋予指定格式的数据 */
            (window as any).clipboardData.setData(options.format||'text',text);

            options.onCopy && options.onCopy((window as any).clipboardData);

            success=true;

        }catch(err){

        }
    }finally{
        if(selection){
            if(typeof selection.removeRange == 'function'){
                selection.removeRange(range);
            }else{
                selection.removeAllRanges();
            }
        }

        if(mark){
            document.body.removeChild(mark);
        }
        reselectPrevious();
    }

    return success;
    
}

