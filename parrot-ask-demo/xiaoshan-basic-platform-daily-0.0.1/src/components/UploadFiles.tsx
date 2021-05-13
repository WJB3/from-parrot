/*
 * @Author: xuhansong
 * @Date: 2020-09-01 15:36:22
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-10-19 14:43:33
 * 自定义ant-img-crop+upload 表单受控组件
 */
import ImgCrop, { ImgCropProps } from 'antd-img-crop';
import React, { useState } from 'react';
import { message, Spin, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import api from 'src/api';
import useUpload from 'src/hook/useUpload';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { refreshToken } from 'src/api/request';
interface UploadFileProps {
  crop?: ImgCropProps | boolean;
  upload?: UploadProps;
  children?: any;
  onChange?: (e: any) => void;
  fileList?: UploadFile[];
  limit?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}
export default function UploadFiles(props: UploadFileProps) {
  const { crop, upload, fileList = [], limit, min, max, disabled } = props;
  const { getHeaders } = useUpload();
  const [loading, setLoading] = useState(false);
  const [header, setHeader] = useState(getHeaders());
  const [files, setFiles] = useState(fileList || []);
  const onPreview = (file: UploadFile) => {
    const url = file.url || file.response?.url;
    if (url) {
      window.open(url);
    }
  };
  const onChange = (e: any) => {
    let fileList = Array.isArray(e) ? e : e.fileList;
    // upload不存在 或者 action存在的情况下 或文件大小超出范围 或文件类型错误 过滤掉阻止上传的文件改动
    const unit = 1024;
    const outLimit = fileList?.length > (props.limit || -1);
    const outSize =
      (min && !crop && e.file.size < min * unit) || (max && !crop && e.file.size > max * unit);
    const outType = !upload?.accept?.includes(e.file.type);
    let flag = outSize || (outType && !e.file.url) || outLimit;
    if ((!e.file.status && (props.upload?.action || !props)) || flag) return;
    if (e.file.status === 'uploading') {
      setLoading(true);
    } else {
      setLoading(false);
    }

    // if(fileList[.status === "error") {
    //   return;
    // }

    for (let i = 0; i < fileList.length; i++) {
      const res = fileList[i].response;
      if (res && res.status === 'UNAUTHORIZED') {
        refreshToken().then(() => {
          setHeader(getHeaders());
        });
        break;
      }
    }

    let filterErrorLists = fileList.filter((item: any) => item.status === 'error');
    let filterOssLists = fileList.filter((item: any) => item.response !== undefined);

    if (filterErrorLists.length && fileList.length) {
      // error存在
      if (filterOssLists.length) {
         message.error({content: '图片上传失败,请稍后再试', key: 'uploadossFailed'})
      } else {
        message.error({content: '网络异常，请检查网络设置', key: 'uploadFailed'});
      }
    }

    fileList = fileList.filter((item: any) => item.status !== 'error');

    console.log(fileList, '🍎');
    props.onChange?.([...fileList]);
    setFiles([...fileList]);
  };
  const beforeUpload = (file: RcFile, curfileList: RcFile[]) => {
    if (curfileList?.length + fileList?.length > (props.limit || -1)) {
      message.error({
        content: '文件数量超过限制',
        key: 'oversize',
      });
      return false;
    }
    const unit = 1024;
    if (!upload?.accept?.includes(file.type)) {
      message.error('文件格式错误');
      return false;
    }
    if (min && !crop && file.size < min * unit) {
      message.error('文件大小不符合要求');
      return false;
    }
    if (max && !crop && file.size > max * unit) {
      message.error('文件大小不符合要求');
      return false;
    }
    if (props.upload?.beforeUpload) {
      return props.upload?.beforeUpload?.(file, curfileList);
    }
    return true;
  };
  let content = props.children || <Spin spinning={loading}>上传</Spin>;

  if (limit !== undefined) {
    content = limit > fileList?.length ? content : null;
  }
  return crop ? (
    <ImgCrop rotate {...crop}>
      <Upload
        action={api.base.uoload}
        headers={header}
        onPreview={onPreview}
        listType='picture-card'
        {...upload}
        fileList={fileList}
        beforeUpload={beforeUpload}
        onChange={onChange}
        disabled={disabled}
        multiple={true}
        className={props.className}>
        {content}
      </Upload>
    </ImgCrop>
  ) : (
    <Upload
      multiple={true}
      action={api.base.uoload}
      headers={header}
      onPreview={onPreview}
      listType='picture-card'
      {...upload}
      fileList={fileList}
      beforeUpload={beforeUpload}
      onChange={onChange}
      disabled={disabled}
      className={props.className}>
      {content}
    </Upload>
  );
}
