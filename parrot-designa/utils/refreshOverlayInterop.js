/*
 * @Author: your name
 * @Date: 2021-01-20 10:45:55
 * @LastEditTime: 2021-01-20 10:46:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/utils/refreshOverlayInterop.js
 */
 

const {
  dismissRuntimeErrors,
  reportRuntimeError,
} = require('react-error-overlay');

module.exports = {
  clearRuntimeErrors: dismissRuntimeErrors,
  handleRuntimeError: reportRuntimeError,
};
