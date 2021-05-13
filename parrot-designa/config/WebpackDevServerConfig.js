/*
 * @Author: your name
 * @Date: 2021-01-19 09:32:55
 * @LastEditTime: 2021-01-27 15:32:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/config/WebpackDevServerConfig.js
 */
const paths=require('./paths');
const ignoredFiles=require('../utils/ignoredFiles');
const getHttpsConfig=require('../utils/getHttpsConfig');

const host=process.env.HOST || 'localhost';

module.exports=function(proxy,allowedHost){
    return {
        //为每个静态文件开启gzip
        compress:true, 
        //启用 webpack 的 Hot Module Replacement 功能：
        hot: true,
        transportMode:'ws',
        injectClient:false, 
        https:getHttpsConfig(),
        //指定要使用的 host。如果你希望服务器可从外部访问.0.0.0.0
        host,
        //出现编译器错误或警告时，在浏览器中显示全屏覆盖
        overlay:false,  
        proxy,
        quiet:true,
        contentBase: paths.appPublic, 
        // By default files from `contentBase` will not trigger a page reload.
        watchContentBase: true,
    }
    
}