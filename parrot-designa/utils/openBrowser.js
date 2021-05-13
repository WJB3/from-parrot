'use strict';
var chalk=require('chalk');
var execSync=require('child_process').execSync;
var spawn=require('cross-spawn');
var open=require('open');

var OSX_CHROME='google chrome';

const ACTIONS=Object.freeze({
    NONE:0,
    BROWSER:1, 
});

function getBrowserEnv(){
    const value=process.env.BROWSER;
    const args=process.env.BROWSER_ARGS
        ? process.env.BROWSER_ARGS.split(' ')
        : [];
    let action;
    if(!value){
        //默认
        action=ACTIONS.BROWSER;
    }else if(value.toLowerCase()==='none'){
        action=ACTIONS.NONE;
    }else{
        action=ACTIONS.BROWSER;
    }
    return {action,value,args}
}

function startBrowserProcess(browser,url){
    try{
        var options={app:browser,wait:false,url:true};
        open(url,options).catch(()=>{});
        return true;
    }catch(err){
        return false;
    }
}
 
function openBrowser(url){
    const { action,value,args }=getBrowserEnv();
    switch(action){
        case ACTIONS.NONE:
            return false;
        case ACTIONS.BROWSER:
            return startBrowserProcess(value,url,args);
        default :
            throw new Error('Not implemented');
    }
}

module.exports=openBrowser;