const http=require('http');
const getBasicNodeMethods=require('./browser');

module.exports=getCurrentNodeMethods() || getBasicNodeMethods();

function getCurrentNodeMethods(){
    return http.METHODS  && http.METHODS.map((method)=>{
        return method.toLowerCase();
    });
}

