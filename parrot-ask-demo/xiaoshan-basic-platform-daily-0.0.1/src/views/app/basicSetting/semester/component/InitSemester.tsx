import React, { useState } from 'react';
import { Modal, Form, Input, Select, message, DatePicker, Alert } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';

export default function InitSemesterModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('开启新学期');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<any>();
  props.onRef({
    setVisible,
    setTitle,
    form: form,
  });
  const handleOk = () => {
    Modal.confirm({
      title: '开启新学期操作之后，不可回退，确定要开启新学期吗？',
      onOk: () => {
        form.validateFields().then(() => {
          const { date, ...rest } = form.getFieldsValue();
          setLoading(true);
          const [startDate, endDate] = date;
          let p: Promise<any>;
          api.semester
            .create({
              ...rest,
              startYear: (rest.startYear as moment.Moment).year(),
              endYear: (rest.startYear as moment.Moment).year() + 1,
              startDate: startDate.format('YYYY-MM-DD'),
              endDate: endDate.format('YYYY-MM-DD'),
            })
            .then((res) => {
              message.success('操作成功');
              setVisible(false);
              props.onOk?.();
            })
            .catch(() => {
              setLoading(false);
            });
        });
      },
    });
  };
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={handleCancel}
      confirmLoading={loading}>
      <Form preserve={false} form={form} initialValues={{}} {...constant.form.layout}>
        <Form.Item name='startYear' label='起始学年' rules={[{ required: true }]}>
          <DatePicker picker='year' />
        </Form.Item>
        <Form.Item name='orderNo' label='学期' rules={[{ required: true }]}>
          <Select placeholder='请选择'>
            {[...constant.semester.orderNo.entries()].map(([value, label]) => (
              <Select.Option value={value}>{label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name='date'
          label='起止时间'
          hasFeedback
          rules={[{ required: true }]}
          extra={
            <p>
              注：若新学期为某学期第一学期，所有学生将按照原班级默认升级。原高三学生将做毕业处理，数据移至学生档案
            </p>
          }>
          <DatePicker.RangePicker />
        </Form.Item>
      </Form>
    </Modal>
  );
}
