import { useMap } from 'ahooks';
import { Button, Form, message, Modal, Select, Space } from 'antd';
import React, { useRef, useState } from 'react';
import api from 'src/api';
import SelectMemberModal from 'src/components/selectMember';
import constant from 'src/constant';
import GT from 'types';
export default function EditLessonGroupModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('编辑备课组');
  const [teachers, setTeachers] = useState<GT.Model.Teacher[]>();
  const [loading, setLoading] = useState(false);
  const [map, { set, get, setAll, reset }] = useMap(new Map());
  const [form] = Form.useForm<any>();
  const modal = useRef<GT.Modal.Ref>();

  const handleOk = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      setLoading(true);
      const params = {
        members: getMembers(),
        leaderId: data.leaderId || null,
        leaderType: 1,
        id: data.id,
      };
      api.group
        .updateLessonGroup(params)
        .then((res) => {
          message.success('编辑成功');
          setVisible(false);
          props.onOk?.();
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };

  const onSearch = (value: string) => {
    api.teacher
      .getPage({
        name: value,
        current: -1,
        size: -1,
      })
      .then((res) => {
        setTeachers(res.list);
      });
  };
  props.onRef({
    setVisible,
    setTitle,
    form: form,
    setMember: setAll,
    getTeachers: onSearch,
  });
  let count = [...map.values()].reduce((sum, item) => {
    if (item.nodes) {
      // item.nodes.forEach((node: any) => {
      //   obj[node.id || node.memberId] = true;
      // });
      sum += item.nodes.length;
    }
    return sum;
  }, 0);

  const getMembers = () => {
    return [...map.entries()].reduce((arr, [type, value]) => {
      if (type === 'organization' || type === 'group') {
        arr = arr.concat(
          value.nodes?.map((node: any) => ({
            memberId: node.id || node.memberId,
            memberType: 1,
          })) || [],
        );
      }
      if (type === 'student') {
        arr = arr.concat(
          value.nodes?.map((node: any) => ({
            memberId: node.id,
            memberType: 2,
          })) || [],
        );
      }
      if (type === 'parent') {
        arr = arr.concat(
          value.nodes?.map((node: any) => ({
            memberId: node.id,
            memberType: 3,
          })) || [],
        );
      }
      return arr;
    }, []);
  };
  return (
    <div>
      <Modal
        title={title}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        afterClose={handleCancel}
        confirmLoading={loading}>
        <Form preserve={false} form={form} initialValues={{}} {...constant.form.layout}>
          <Form.Item name='id' hidden={true}></Form.Item>
          <Form.Item name='name' label='备课组信息' rules={[{ required: true }]}>
            {form.getFieldValue('name')}
          </Form.Item>
          <Form.Item name='leaderId' label='组长'>
            <Select
              showSearch
              showArrow
              onSearch={onSearch}
              allowClear
              onDropdownVisibleChange={(open) => open && onSearch('')}
              placeholder='请输入'
              filterOption={false}>
              {teachers?.map((t) => (
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
          <Form.Item name='member' label='成员'>
            <Space>
              {count ? (
                <span style={{ fontSize: 13, color: '#616266' }}>
                  已选中<em style={{ color: '#5781F2' }}>{count}</em>人
                </span>
              ) : null}
              <Button
                type='link'
                onClick={() => {
                  modal.current?.setVisible(true);
                  modal.current?.setMembers(map);
                }}>
                选择
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <SelectMemberModal
        tabs={['organization']}
        groupType='lesson'
        onRef={(ref) => (modal.current = ref)}
        onOk={(data) => {
          form.setFieldsValue({ member: data });
          setAll(data);
        }}></SelectMemberModal>
    </div>
  );
}
