import React, { useState } from 'react';
import { Modal, Form, Select, Radio, message, Checkbox, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import { useRequest } from 'ahooks';
const { Option } = Select;

export default function CreateSectionModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增学段');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<any>();
  // const [year, setYear] = useState(['' + new Date().getFullYear(), '' + new Date().getFullYear()]);
  const { data: year } = useRequest(api.semester.getCurrentYear);
  const [checked, setChecked] = useState([false, false]);
  props.onRef({
    setVisible,
    setTitle,
    form: form,
  });

  const handleOk = () => {
    form.validateFields().then(() => {
      const { sections } = form.getFieldsValue();
      if (checked.some((val) => val)) {
        let params = checked
          .map((val, index) => {
            if (val) {
              let current = sections[index];
              return {
                ...current,
                currentYear: current.currentYear?.format('yyyy'),
              };
            }
            return null;
          })
          .filter((item) => item);
        setLoading(true);
        api.section
          .create(params)
          .then(() => {
            setVisible(false);
            message.success('新增成功');
            props.onOk && props.onOk();
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        message.warn('请选择新增年段');
      }
      //
    });
  };
  const sections = [
    {
      type: 1,
      name: '高中',
      namingMethod: 0,
      numbers: [1, 1, 1],
      currentYear: moment(year),
    },
    {
      type: 2,
      name: '初中',
      namingMethod: 0,
      numbers: [1, 1, 1],
      currentYear: moment(year),
    },
  ];
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.setFieldsValue({ sections });
    setChecked([false, false]);
  };

  return (
    <Modal
      title={title}
      visible={visible}
      width='80%'
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={handleCancel}
      confirmLoading={loading}>
      <Form
        preserve={false}
        colon={false}
        form={form}
        initialValues={{
          sections,
        }}
        {...constant.form.layout}>
        <Form.List name='sections'>
          {(fields) => {
            return fields.map((field, index) => (
              <Form.Item
                {...field}
                label={
                  <Checkbox
                    checked={checked[index]}
                    onChange={(e) => {
                      checked[index] = e.target.checked;
                      setChecked([...checked]);
                      const current = form.getFieldValue('sections');
                      current.splice(index, 1, sections[index]);
                      form.setFieldsValue({
                        sections: [...current],
                      });
                    }}>
                    {sections[index].name}
                  </Checkbox>
                }>
                {checked[index] && (
                  <div>
                    <Form.Item
                      label={index === 0 ? '当前高一入学年份' : '当前初一入学年份'}
                      name={[field.name, 'currentYear']}
                      rules={[{ required: true }]}
                      fieldKey={[field.fieldKey, 'currentYear']}>
                      {year}
                    </Form.Item>
                    <Form.Item
                      label=''
                      name={[field.name, 'namingMethod']}
                      fieldKey={[field.fieldKey, 'namingMethod']}>
                      <Radio.Group>
                        <Radio value={0} key={0}>
                          按“届”命名
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Row>
                      <Col span={8}>
                        <Row align='middle'>
                          <Form.Item
                            style={{ marginBottom: 0 }}
                            label={`${sections[index].name}${(year || 0) + 3}届`}
                            name={[field.name, 'numbers', 0]}
                            fieldKey={[field.fieldKey, 'numbers', 0]}>
                            <Select options={constant.classes.selectOptions}></Select>
                          </Form.Item>
                          <span>个班级</span>
                        </Row>
                      </Col>
                      <Col span={8}>
                        <Row align='middle'>
                          <Form.Item
                            style={{ marginBottom: 0 }}
                            label={`${sections[index].name}${(year || 0) + 2}届`}
                            name={[field.name, 'numbers', 1]}
                            fieldKey={[field.fieldKey, 'numbers', 1]}>
                            <Select options={constant.classes.selectOptions}></Select>
                          </Form.Item>
                          <span>个班级</span>
                        </Row>
                      </Col>
                      <Col span={8}>
                        <Row align='middle'>
                          <Form.Item
                            style={{ marginBottom: 0 }}
                            label={`${sections[index].name}${(year || 0) + 1}届`}
                            name={[field.name, 'numbers', 2]}
                            fieldKey={[field.fieldKey, 'numbers', 2]}>
                            <Select options={constant.classes.selectOptions}></Select>
                          </Form.Item>
                          <span>个班级</span>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                )}
              </Form.Item>
            ));
          }}
        </Form.List>
      </Form>
    </Modal>
  );
}
