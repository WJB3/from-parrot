/*
 * @Author: xuhansong
 * @Date: 2020-09-03 16:25:06
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-10-13 10:03:10
 * 下载文件
 */
import React from "react";
import moment from "moment";
import api from "src/api";
import GT from "types";
export default function useDownload() {
  function download(options: GT.Model.ExportRes) {
    const date = moment().format("YYYYMMDDHHmm");
    let filename: string = options.fileName;
    console.log(filename, "下载图片名称");
    return api.base
      .download(options.url, {
        responseType: "blob",
      })
      .then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        // let isSupportDownload = "download" in document.createElement("a");
        // console.log("浏览器是否支持下载", isSupportDownload);
        // console.log(link, "下载link");
        link.click();
        link.remove();
      });
  }
  function dataURLtoBlob(data: string) {
    var arr = data.split(",");
    //注意base64的最后面中括号和引号是不转译的
    var _arr = arr[1].substring(0, arr[1].length - 2);
    var mime = arr[0].match(/:(.*?);/)?.[1],
      bstr = atob(_arr),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime,
    });
  }
  function downloadBase64(options: { dataURL: string; fileName: string }) {
    const blob = dataURLtoBlob(options.dataURL);
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", options.fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  return {
    download,
    downloadBase64,
  };
}
