import { useRequest } from 'ahooks';
import { Carousel, Form, Radio, Row, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useRef, useState } from 'react';
import api from 'src/api';
import GT from 'types';
export default function RoleDataScopeTab(props: {
  id: number;
  disabled?: boolean;
  defaultValue?: GT.Model.RoleDataScope[];
  onRef?: (ref: { getFormData: () => Promise<GT.Model.RoleDataScope[]> }) => void;
}) {
  const [tab, setTab] = useState(1);
  const [teacherForm] = useForm();
  const [studentForm] = useForm();
  const carousel = useRef<Carousel>(null);
  const { data: sections } = useRequest(() => api.section.getAll({ params: { all: true } }));
  const tabList = [
    {
      value: 1,
      label: '老师数据',
    },
    {
      value: 2,
      label: '学生数据',
    },
  ];
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  const getFormData = () => {
    return Promise.all([teacherForm.validateFields(), studentForm.validateFields()]).then(() => {
      return [teacherForm.getFieldsValue(), studentForm.getFieldsValue()];
    });
  };
  props.onRef?.({
    getFormData,
  });
  const get = (dataType: number) => {
    if (props.defaultValue) {
      return props.defaultValue.find((item) => item.dataType === dataType);
    }
    return {};
  };
  return (
    <div>
      <p>
        <Radio.Group
          buttonStyle='solid'
          value={tab}
          onChange={(e) => {
            carousel.current?.goTo(e.target.value - 1, true);
            setTab(e.target.value);
          }}>
          {tabList.map((item) => (
            <Radio.Button value={item.value}>{item.label}</Radio.Button>
          ))}
        </Radio.Group>
      </p>
      <p>
        <Carousel ref={carousel}>
          {tabList.map((item) => (
            <Form
              form={item.value === 1 ? teacherForm : studentForm}
              initialValues={{ scope: 0, dataType: item.value, ...get(item.value) }}>
              <Form.Item hidden={true} name='dataType'></Form.Item>
              <Form.Item label='数据范围' name='scope' rules={[{ required: true }]}>
                <Radio.Group disabled={props.disabled}>
                  <Radio style={radioStyle} value={0}>
                    无
                  </Radio>
                  <Radio style={radioStyle} value={1}>
                    全部
                  </Radio>
                  {item.value === 2 && (
                    <Row align='middle'>
                      <Radio value={2}>学段</Radio>
                      <Form.Item
                        noStyle
                        name='sectionType'
                        rules={[
                          {
                            validator: (rule, val) => {
                              if (studentForm.getFieldValue('scope') === 2 && !val) {
                                return Promise.reject('请选择年段');
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}>
                        <Select
                          style={{ width: 100 }}
                          disabled={props.disabled}
                          optionFilterProp='children'>
                          {sections?.map((section) => (
                            <Select.Option value={section.id}>{section.name}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Row>
                  )}
                </Radio.Group>
              </Form.Item>
            </Form>
          ))}
        </Carousel>
      </p>
    </div>
  );
}
