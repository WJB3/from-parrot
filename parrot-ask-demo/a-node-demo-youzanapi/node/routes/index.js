var express = require('express');
var router = express.Router();
const youzanyun = require('youzanyun-sdk');

const token = 'd5603247352cbff4a09868d10e3dc9a';
const params = {
  "tid": "E20210423144405033602064"
}; 

/* GET home page. */
router.get('/', function (req, resa, next) {
  const params = {
    "tid": ""
  }; 
  youzanyun.client.call({
    api: 'youzan.trade.get',
    version: '4.0.0',
    token,
    params,
  }).then((res)=>{
    console.log("res",res.data)
    resa.json({
      status: '1',
      msg: res.data
    });
  });
});


router.get('/detail', function (req, resa, next) {
  const params = {
    "dist_id":""
  };
  youzanyun.client.call({
    api: 'youzan.logistics.online.distorder.query.querybydistid',
    version: '3.0.0',
    token,
    params,
  }).then((res)=>{
    console.log("res",res.data)
    resa.json({
      status: '1',
      msg: res.data
    });
  });
});

module.exports = router;
