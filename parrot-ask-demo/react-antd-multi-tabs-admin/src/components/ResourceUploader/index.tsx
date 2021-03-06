import React, { useState, useRef, useEffect } from 'react';
import { Space, Form, Input, Button, Modal, DatePicker } from 'antd';
import CustomUploader from '@/components/CustomUploader/index';

const ResourceUploader = (props) => {

    const {
        type
    } = props;

    const imgLoaderRef = useRef(null);

    const [imgVisible, setImgVisible] = useState(false);

    const [value, setValue] = useState();


    const handleSuccessUpload = () => {
        const file = imgLoaderRef.current.fileList[0];
        console.log("file", file)
        const successUrl = file.successUrl;
        props?.onChange?.(file)
        setValue(successUrl)
    }

    useEffect(()=>{
        setValue(props.value)
    },[props.value])

    return (
        <div style={{ display: 'flex' }}>

            <CustomUploader visible={imgVisible} max={1} size={1000} ref={imgLoaderRef} extraAccept={type==='image'?[]:['sql','zip', 'doc', 'docx', 'pdf','video']} successUploader={handleSuccessUpload} onCancel={() => setImgVisible(false)} /> 
            
            <Input value={value} />

            <Button type="primary" onClick={() => { setImgVisible(true) }}>上传</Button>
        </div>

    )

}

export default ResourceUploader;
