import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './Uploader.less';
import { Upload, message } from 'antd';

export default function Uploader(props:any){
  const { value }=props;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  } 

  const uploadButton = (
    <div className={styles['auploader']}>
      {loading ? <LoadingOutlined style={{fontSize:20}}/> : <PlusOutlined style={{fontSize:26}} />}
      <div className={styles['auploader-text']}>Upload</div>
    </div>
  );

  useEffect(()=>{
    setImageUrl(value)
  },[value]);

  return (
    <div 
      className={styles['avatar-uploader']}
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </div>
  );
};
