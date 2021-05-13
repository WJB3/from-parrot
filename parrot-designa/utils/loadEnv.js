'use strict';
const fs=require('fs');
const path=require('path');

function log(message){
    console.log(`[loadEnv][DEBUG] ${message}`);
}
//换行符 
//匹配形如 a=b、 a = b 
const RE_INI_KEY_VAL=/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
//匹配2个换行 
const NEWLINES_MATCH = /\n|\r|\r\n/;

function parse(src,options){
   

    const debug=Boolean(options && options.debug);
    const obj={}

    src.toString().split(NEWLINES_MATCH).forEach(function(line,idx){ 
        //匹配key-value
        const keyValueArr=line.match(RE_INI_KEY_VAL);
  
        //是否匹配
        if(keyValueArr!=null){
            const key=keyValueArr[1]
            let val=(keyValueArr[2] || '');
            const end=val.length-1;
            const isDoubleQuoted=val[0]==='"'  && val[end]==='"';
            const isSingleQuoted=val[0]==="'" && val[end]==="'";
            //如果有双引号或者单引号，将其移除
            if(isDoubleQuoted || isSingleQuoted){
                val=val.substring(1,end);
            }else{
                val=val.trim();
            }
            obj[key]=val
        }else if(debug){
            log(`did not match key and value when parsing line ${idx + 1}: ${line}`)
        }
    })
    return obj;
}

function config(options){
    //将路径解析成为绝对路径
    let loadEnvPath=path.resolve(process.cwd(),'.env');
    let encoding='utf8';
    let debug=false;

    if(options){
        if(options.path!=null){
            loadEnvPath=options.path;
        }
        if(options.encoding!=null){
            encoding=options.encoding;
        }
        if(options.debug!=null){
            debug=true;
        }
    }
    
    try{
        const parsed=parse(fs.readFileSync(loadEnvPath,{encoding}),{debug});
      
        Object.keys(parsed).forEach(function(key){
            if(!Object.prototype.hasOwnProperty.call(process.env,key)){
                //如果env上没有属性，就赋值
                process.env[key]=parsed[key]
                
            }else if(debug){
                log(`"${key}" is already defined in \`process.env\` and will not be overwritten`)
            }
        })

        return {parsed}
    }catch(e){
        return {error:e}
    }
}

module.exports.config=config;

  