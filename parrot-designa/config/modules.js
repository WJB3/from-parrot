'use strict';
const paths=require("./paths")
var chalk = require('chalk');


function getAdditionalModulePaths(options={}){

    const baseUrl=options.baseUrl;

    if(!baseUrl){
        return '';
    }

    const baseUrlResolved=path.resolve(paths.appPath,baseUrl);

    if(path.relative(paths.appNodeModules,baseUrlResolved)===''){
        return null;
    }

    if (path.relative(paths.appSrc, baseUrlResolved) === '') {
        return [paths.appSrc];
    }

    if (path.relative(paths.appPath, baseUrlResolved) === '') {
        return null;
    }
    
    throw new Error(
        chalk.red.bold(
          "Your project's `baseUrl` can only be set to `src` or `node_modules`." +
            ' Create Scaffold App does not support other values at this time.'
        )
    );

}

function getWebpackAliases(options={}){
    const baseUrl=options.baseUrl;
    if(!baseUrl){
        return {};
    }
    const baseUrlResolved=path.resolve(paths.appPath,baseUrl);

    if(path.relative(paths.appPath,baseUrlResolved)===''){
        return {
            src:paths.appSrc
        }
    }
}

function getModules(){

    let config;

    config=config||{};

    const options=config.compilerOptions||{};

    const additionalModulePaths=getAdditionalModulePaths(options);

    return {
        additionalModulePaths:additionalModulePaths,
        webpackAliases:getWebpackAliases(options),
    }
}

module.exports=getModules();