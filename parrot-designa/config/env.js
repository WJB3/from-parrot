'use strict';

const fs=require('fs'); 
const paths=require("./paths");

const NODE_ENV=process.env.NODE_ENV;

if(!NODE_ENV){
    throw new Error(
        'The NODE_ENV environment variable is requires but was not specified'
    );
}

const customizeFiles=[
    `${paths.customizeenv}.${NODE_ENV}.local`,
    NODE_ENV!=='test' && `${paths.customizeenv}.local`,
    `${paths.customizeenv}.${NODE_ENV}`,
    paths.customizeenv
].filter(Boolean);


customizeFiles.forEach(envFile=>{
    if(fs.existsSync(envFile)){
        require("../utils/loadEnv").config({
            path:envFile
        })
    }
})
