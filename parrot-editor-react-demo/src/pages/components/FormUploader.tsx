import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './Uploader.less';
import { Upload, message } from 'antd';

const prefixUrl='https://cooluder.ngrok.langengel.com'

export default function Uploader(props: any) {
  const { onChange,value } = props;
  const [loading, setLoading] = useState(false);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList }: any) => {
    setFileList(fileList);
    if(fileList &&  fileList.length>0 && fileList[0].status==='done'){
        if (fileList.length > 0) {
            onChange(`${prefixUrl}${fileList[0].response.url}`)
        } 
    } else{
      onChange('')
    }
  };

  useEffect(()=>{
    if(!value){
      setFileList([])
    }
    if(value){
      setFileList([{
        uid: '-2',
        name: 'image.png',
        status: 'done',
        url: value
      }])
    }
  },[value]);
 

  return (
    <Upload
      name={'activity_image'}
      action="https://cooluder.ngrok.langengel.com/service/activity/image/upload"
      listType="picture-card"
      fileList={fileList}
      onChange={handleChange}
    >
      {fileList.length >= 1 ? null : uploadButton}
    </Upload>
  );
}
