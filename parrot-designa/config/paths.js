/*
 * @Author: your name
 * @Date: 2021-01-19 09:32:55
 * @LastEditTime: 2021-01-21 13:37:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/config/paths.js
 */
'use strict';
const path=require("path");
const fs=require("fs");
const getPublicUrlOrPath=require("../utils/getPublicUrlOrPath");


const moduleFileExtensions=[
    'js',
    'ts',
    'tsx',
    'jsx',
    'json'
]
//fs.realpathSync 返回已解析的路径名 process.cwd会返回Node.js进程的当前工作目录
const appDirectory = fs.realpathSync(process.cwd());
//path.resolve() 方法会将路径或路径片段的序列解析为绝对路径。
const resolveApp=relativePath=>path.resolve(appDirectory,relativePath);

const publicUrlOrPath=getPublicUrlOrPath(
    process.env.NODE_ENV==='development',
    require(resolveApp("package.json")).homepage,
    process.env.PUBLIC_URL
)

const publicUrlOrPathFunc=()=>getPublicUrlOrPath(
    process.env.NODE_ENV==='development',
    require(resolveApp("package.json")).homepage,
    process.env.PUBLIC_URL
)

const resolveModule=(resolveFn,filePath)=>{
    const extension=moduleFileExtensions.find(extension=>
        fs.existsSync(resolveFn(`${filePath}.${extension}`))
    );
    if(extension){
        return resolveFn(`${filePath}.${extension}`)
    }
    return resolveFn(`${filePath}.js`)
}
 


module.exports={
    appPath: resolveApp('.'),
    customizeenv: resolveApp('.env'),
    appBuild: resolveApp('build'),
    appSrc: resolveApp('src'),
    appEslintrc: resolveApp('.eslintrc'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appFavicon: resolveApp('public/favicon-parrot.ico'),
    yarnLockFile: resolveApp('yarn.lock'),
    appNodeModules:resolveApp('node_modules'),
    appTsConfig: resolveModule(resolveApp,'tsconfig'),
    appIndexJs:resolveModule(resolveApp,'src/index'), 
    appPackageJson:resolveModule(resolveApp,'package'),
    publicUrlOrPath,
    publicUrlOrPathFunc
}

module.exports.moduleFileExtensions = moduleFileExtensions;