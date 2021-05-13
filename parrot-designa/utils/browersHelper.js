'use strict';
//所有的工具将自动的查找当前工程规划的目标浏览器范围
const browserslist = require('browserslist');
//一个美化控制台的包
const chalk=require("chalk");
//os 模块提供了一些基本的系统操作函数 EOL//操作系统特定的行末标志
const os=require("os");
//轻巧，美观且用户友好的交互式提示
const prompts=require("prompts");
//找到最近的文件
const pkgUp=require("pkg-up");
const fs=require("fs");

const defaultBrowers={
    production:[">0.2%",'not dead','not op_mini all'],
    development:[
        'last 1 chrome version',
        'last 1 firefox version',
        'last 1 safari version'
    ]
   
}

function shouldSetBrowsers(isInteractive){
    if(!isInteractive){
        return Promise.resolve(true);
    }
    const question={
        type:'confirm',
        name:'shouldSetBrowsers',
        message:chalk.yellow("We're unable to detect target browers.")+
        `\n\nWould you like to add the defaults to you ${chalk.bold(
            'package.json'
        )}`,
        initial:true
    }
    return prompts(question).then(answer=>{
        return  answer.shouldSetBrowsers  
    }) 
}

function checkBrowsers(dir,isInteractive,retry=true){
 
    const current=browserslist.loadConfig({path:dir}); 
     
    if(current!=null){
        return Promise.resolve(current);
    }

    if(!retry){
        return Promise.reject(
            new Error(
                chalk.red(
                    'As of react-script >=2 you must specify targeted browers.;'
                )+os.EOL+`Please add a ${chalk.underline(
                    'browerslist'
                )} key to your ${chalk.bold('package.json')}.`
            )
        )
    }
    
    return shouldSetBrowsers(isInteractive).then(shouldSetBrowsers=>{
     
        if(!shouldSetBrowsers){
            return checkBrowsers(dir, isInteractive, false);
        }

        return (
            pkgUp({cwd:dir})
                .then(filePath=>{ 
                    if(filePath==null){
                        return Promise.reject();
                    }
                    const pkg=JSON.parse(fs.readFileSync(filePath));
                  
                    pkg['browserslist']=defaultBrowers;
                    fs.writeFileSync(filePath,JSON.stringify(pkg,null,2)+os.EOL);

                    browserslist.clearCaches(); 
                    console.log(
                        `${chalk.gree("Set target browsers:")} ${chalk.cyan(
                            defaultBrowers.join(",")
                        )}`
                    )
                })
                .catch(()=>{})
                .then(() => checkBrowsers(dir, isInteractive, false))
        )
    })
}

module.exports={defaultBrowers,checkBrowsers};
