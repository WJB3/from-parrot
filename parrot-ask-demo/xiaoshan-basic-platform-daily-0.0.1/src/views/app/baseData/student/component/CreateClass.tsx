//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Space, message, Cascader } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';
import { useRequest } from 'ahooks';
const { Option } = Select;

export default function CreateClassModal(
  props: GT.Modal.Props & {
    sections: any[];
    grades: any[];
    gradeDisabled?: boolean;
    building:any[];
  },
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增班级');
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<GT.Model.Teacher[]>([]);
  const { renderSelect, renderRadio } = useDictionary();
  const [rooms, setRooms] = useState<GT.Model.BuildingTree[]>();
  const [form] = Form.useForm<GT.DTO.CreateClassDto>();
  const [formData, setFormData] = useState<GT.DTO.CreateClassDto>();
  const { data = [] } = useRequest(() => api.section.getTree({ all: false }));
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
      formData?.enrollmentYear && onGradeChange(formData.enrollmentYear);
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
  console.log("--options--",options)
  const handleOk = () => {
    form.validateFields().then(() => {
      const { building, ...data } = form.getFieldsValue();
      const [buildingId, floorId, roomId] = building || [];
      setLoading(true);
      if (data.id) {
        api.classes
          .update({
            ...data,
            roomId: roomId || null,
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
            ...data,
            roomId,
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
    api.classes
      .getLeaderCandidatePage({
        current: -1,
        size: -1,
        name: value,
      })
      .then((res) => {
        setTeachers(res.list);
      });
  };
  const getGradeName = (year: number) => {
    const index = props.grades.findIndex((item) => item.enrollmentYear === year);
    return props.grades[index]?.gradeName;
  };
  const validateBuilding = (rule: any, val: any) => {
    if (val?.length && val.length !== 3) {
      return Promise.reject('请选择房间');
    }
    return Promise.resolve();
  };
  const onGradeChange = (enrollmentYear: number) => {
    const { sectionId, id } = formData || {};

    if (sectionId && enrollmentYear && !id) {
      api.classes
        .getPage({
          current: -1,
          size: -1,
          sectionId,
          enrollmentYear,
        })
        .then((res) => {
          form.setFieldsValue({
            ...form.getFieldsValue(),
            orderNumber: res.list.length && res.list[res.list.length - 1].orderNumber + 1,
          });
        });
    }
  };
  props.onRef({
    setVisible,
    setTitle,
    form: form,
    setFormData,
    onSearch,
    setTeachers,
  });

  // useEffect(()=>{
  //   console.log("asdadasdasdas,",props.building,visible)
  //   if(props.building && props.building.length && visible && options && options.length){
  //     console.log("asdadasdasdas")
  //     form?.setFieldsValue({  
  //       building:props.building
  //     });
  //   }
  // },[props.building,form,visible,options]);

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
        initialValues={{
          building: [],
          classType: 0,
        }}
        {...constant.form.layout}
        onValuesChange={onValuesChange}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item name='sectionId' label='学段' hasFeedback rules={[{ required: true }]}>
          <Select disabled>
            {props.sections.map((item) => (
              <Select.Option value={item.sectionId}>{item.sectionName}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name='enrollmentYear'
          label='年级'
          hasFeedback
          validateFirst
          rules={[{ required: true, message: '请选择年级' }]}>
          <Select
            placeholder='请选择'
            disabled={props.gradeDisabled}
            onChange={(val) => onGradeChange(Number(val))}>
            {props.grades.map((item) => (
              <Select.Option value={item.enrollmentYear}>{item.gradeName}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label='班级名称' name='orderNumber' required hidden={!formData?.enrollmentYear}>
          <Space>
            {formData?.enrollmentYear && getGradeName(formData?.enrollmentYear)}
            <Form.Item
              name='orderNumber'
              hidden={!formData?.enrollmentYear}
              noStyle
              hasFeedback
              validateFirst
              rules={[
                { required: true, message: '请选择班级名称' },
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

        <Form.Item name='classType' label='班级类型' hasFeedback>
          {renderSelect('classType')}
        </Form.Item>
        <Form.Item name='headTeacherId' label='班主任' hasFeedback>
          <Select
            showSearch
            allowClear
            showArrow
            onSearch={onSearch}
            placeholder='请输入'
            onDropdownVisibleChange={(open) => open && onSearch('')}
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
