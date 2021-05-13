import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Space, message, Cascader } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';
import { useRequest } from 'ahooks';
const { Option } = Select;

export default function CreatePreClassModal(
  props: GT.Modal.Props & {
    sectionId: number;
    enrollmentYear: number;
  },
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增预备班');
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<GT.Model.Teacher[]>([]);
  const [form] = Form.useForm<GT.DTO.CreateClassDto>();
  const [formData, setFormData] = useState<GT.DTO.CreateClassDto>();
  const [rooms, setRooms] = useState<GT.Model.BuildingTree[]>();
  useEffect(() => {
    if (visible) {
      api.building
        .getRoomTree({
          params: {
            roomId: formData?.roomId,
          },
        })
        .then((res) => {
          setRooms(res);
        });
      // formData?.enrollmentYear && onGradeChange(formData.enrollmentYear);
    }
  }, [visible]);
  const options = rooms?.map((item) => {
    return {
      label: item.buildingName,
      value: item.buildingId,
      children: item.floorTreeDTOS.map((floor) => {
        return {
          label: floor.floorName,
          value: floor.floorId,
          children: floor.roomTreeDTOS.map((room) => {
            return {
              label: room.roomName,
              value: room.roomId,
            };
          }),
        };
      }),
    };
  });
  const handleOk = () => {
    form.validateFields().then(() => {
      const { building, ...data } = form.getFieldsValue();
      const [buildingId, floorId, roomId] = building || [];
      setLoading(true);
      if (data.id) {
        api.classes
          .update({
            sectionId: props.sectionId,
            enrollmentYear: props.enrollmentYear,
            ...data,
            roomId,
          })
          .then(() => {
            message.success('编辑成功');
            setVisible(false);
            props.onOk?.();
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        api.classes
          .create({
            sectionId: props.sectionId,
            enrollmentYear: props.enrollmentYear,
            ...data,
          })
          .then(() => {
            message.success('新增成功');
            setVisible(false);
            props.onOk?.();
          })
          .catch(() => {
            setLoading(false);
          });
      }
    });
  };
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };
  const onValuesChange = (val: any, all: any) => {
    setFormData(all);
  };
  const onSearch = (value: string) => {
    api.teacher
      .getPage({
        current: -1,
        size: -1,
        name: value,
      })
      .then((res) => {
        setTeachers(res.list);
      });
  };
  props.onRef({
    setVisible,
    setTitle,
    form: form,
    onSearch,
    setTeachers,
  });
  const validateBuilding = (rule: any, val: any) => {
    if (val?.length && val.length !== 3) {
      return Promise.reject('请选择房间');
    }
    return Promise.resolve();
  };
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={handleCancel}
      confirmLoading={loading}>
      <Form
        preserve={false}
        form={form}
        initialValues={{}}
        {...constant.form.layout}
        onValuesChange={onValuesChange}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item label='预备班名称' name='orderNumber' rules={[{ required: true }]}>
          <Space>
            预备
            <Form.Item
              name='orderNumber'
              noStyle
              hasFeedback
              validateFirst
              rules={[
                { required: true },
                {
                  validator: (rule, val) => {
                    if (val > 50) {
                      return Promise.reject('班级数量不能超过50个');
                    }
                    return Promise.resolve();
                  },
                },
              ]}>
              <Select options={constant.classes.selectOptions}></Select>
            </Form.Item>
            班
          </Space>
        </Form.Item>

        <Form.Item name='headTeacherId' label='班主任' hasFeedback>
          <Select
            showSearch
            allowClear
            showArrow
            onSearch={onSearch}
            onDropdownVisibleChange={() => {
              onSearch('');
            }}
            placeholder='请输入'
            filterOption={false}>
            {teachers.map((t) => (
              <Select.Option value={t.id}>
                <div>
                  <div>
                    <span style={{ fontSize: 13 }}>{t.name}</span>
                    <span style={{ fontSize: 12, color: '#909499' }}>({t.phone})</span>
                  </div>
                  <div style={{ color: '#616266', fontSize: 12 }}>{t.departmentName}</div>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='building' label='班级教室' rules={[{ validator: validateBuilding }]}>
          <Cascader options={options}></Cascader>
        </Form.Item>
      </Form>
    </Modal>
  );
}
