import React, { useEffect, useState } from 'react';
import styles from './Form.less';
import {
  Form,
  Input, 
} from 'antd';
import Uploader from './FormUploader';

export default function FormDemo(props: any) {

  const [form] = Form.useForm();

  const [componentSize, setComponentSize] = useState<any>('default');

  const { currentComponent, onValuesChange,active,currentValue } = props;

  const onFormLayoutChange = ({ alertTitle, textareaValue,imgUrl }: any) => {
    onValuesChange({
      currentComponent,
      alertTitle,
      textareaValue,
      imgUrl,
      active
    });
  };

  useEffect(()=>{
    console.log("useEffects",active,currentComponent,currentValue)
    if(currentComponent==="alert"){
      form.setFieldsValue({ 
        alertTitle:currentValue
      });
    }else if(currentComponent==='textarea'){
      form.setFieldsValue({ 
        textareaValue:currentValue
      });
    }else{
      form.setFieldsValue({ 
        imgUrl:currentValue
      });
    }
  },[active,currentComponent,currentValue]);

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={{ size: componentSize }}
      onValuesChange={onFormLayoutChange}
      size={componentSize}
      form={form}
    >
      {currentComponent === 'alert' && (
        <Form.Item label="标题" name="alertTitle">
          <Input maxLength={15} placeholder={"最多可输入15字！"} />
        </Form.Item>
      )} 

      {currentComponent === 'textarea' && (
        <Form.Item label="文本区域" name="textareaValue">
          <Input.TextArea placeholder="请输入，可换行" autoSize />
        </Form.Item>
      )}

      {currentComponent === 'uploader' && (
        <Form.Item label="选择图片" name="imgUrl">
          <Uploader />
        </Form.Item>
      )}
    </Form>
  );
}
