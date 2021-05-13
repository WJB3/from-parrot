
const path=require('path');
const paths=require('../config/paths');
const fs=require('fs');
const chalk=require('chalk');
const crypto =require('crypto');

//确保提供的证书和密钥是有效的
function validateKeyAndCerts({cert,key,keyFile,crtFile}){
    let encrypted;
    try{
        encrypted=crypto.publicEncrypt(cert,Buffer.from('test'));
    }catch(err){
        throw new Error(
            `The certificate "${chalk.yellow(crtFile)}" is invalid.\n${err.message}`
        )
    }
}

// 读取文件，如果不存在返回一个错误
function readEnvFile(file, type) {
    if (!fs.existsSync(file)) {
      throw new Error(
        `You specified ${chalk.cyan(
          type
        )} in your env, but the file "${chalk.yellow(file)}" can't be found.`
      );
    }
    return fs.readFileSync(file);
}

function getHttpsConfig(){
    const { SSL_CRT_FILE,SSL_KEY_FILE,HTTPS }=process.env;
    const isHttps=HTTPS==='true';

    if(isHttps && SSL_CRT_FILE && SSL_LEY_FILE){
        const crtFile=path.resolve(paths.appPath,SSL_CRT_FILE);
        const keyFile=path.resolve(paths.appPath,SSL_KEY_FILE);
        const config={
            cert:readEnvFile(crtFile,'SSL_CRT_FILE'),
            key:readEnvFile(keyFile,'SSL_KEY_FILE')
        };
        validateKeyAndCerts({...config,keyFile,crtFile});
        return config;
    }
    return isHttps;
}

module.exports=getHttpsConfig;