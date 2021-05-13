'use strict';

const { URL } =require('url');

module.exports = getPublicUrlOrPath;

function getPublicUrlOrPath(isEnvDevelopment,homepage,envPublicUrl){
 
    const stubDomain="https://www.baidu.com"; 
    if(envPublicUrl){
        //为了确保envPublicUrl最后以/结尾
        envPublicUrl=envPublicUrl.endsWith('/')
            ?envPublicUrl
            :envPublicUrl+'/'

        //如果envPublicUrl是一个相对路径，需要stubDomain,否则忽略
        const validPublicUrlPathname=new URL(envPublicUrl,stubDomain).pathname;

        return isEnvDevelopment
            ? envPublicUrl.startsWith(".")
                ? '/'
                : validPublicUrlPathname
            : envPublicUrl;
            
    }

    if(homepage){
        homepage=homepage.endsWith("/")?homepage:homepage+'/';

        const validHomepagePathname=new URL(homepage,stubDomain).pathname;

        return isEnvDevelopment
            ? homepage.startsWith(".")
                ? '/'
                : validHomepagePathname
            : homepage.startsWith(".")
                ? homepage
                : validHomepagePathname
    }

    return '/';

}