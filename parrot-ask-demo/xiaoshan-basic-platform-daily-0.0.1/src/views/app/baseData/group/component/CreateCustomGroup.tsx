import { useMap } from 'ahooks';
import { Button, Form, Input, message, Modal, Select, Space, Tag } from 'antd';
import { copyFile } from 'fs';
import React, { useRef, useState } from 'react';
import api from 'src/api';
import SelectMemberModal from 'src/components/selectMember';
import SelectLeaderModal from 'src/components/selectMember/SelectLeader';
import constant from 'src/constant';
import useDictionary from 'src/hook/useDictionary';
import GT from 'types';
export default function CreateCustomGroupModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增群组');
  const { renderSelect } = useDictionary();
  const [map, { set, get, setAll, reset }] = useMap(new Map());
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<any>();
  const modal = useRef<GT.Modal.Ref>();
  const leaderModal = useRef<GT.Modal.Ref>();
  const [leader, setLeader] = useState<{
    leaderType: number;
    leaderId: number;
    leaderName: string;
    number?: number;
  }>();

  props.onRef({
    setVisible,
    setTitle,
    form: form,
    setLeader,
    setMember: setAll,
  });
  const handleOk = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      setLoading(true);
      const members = getMembers();
      const { leaderId, leaderType, number } = data.leader || {};
      const params = {
        members,
        leaderId,
        leaderType,
        number,
        id: data.id,
        name: data.name,
        propertyType: data.propertyType,
      };
      if (data.id) {
        api.group
          .update(params)
          .then((res) => {
            message.success('编辑成功');
            setVisible(false);
            props.onOk?.();
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        api.group
          .create(params)
          .then((res) => {
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
    reset();
    setLeader(undefined);
  };

  let count = [...map.values()].reduce((sum, item) => {
    console.log(sum, 123);
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
            number: node.number,
            memberType: node.memberType || 1,
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
            memberId: node.studentId || node.id,
            number: node.number,
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
          <Form.Item name='name' label='群组名称' rules={[{ required: true, whitespace: true }]}>
            <Input maxLength={10} placeholder='请输入'></Input>
          </Form.Item>
          <Form.Item
            name='propertyType'
            label='群组性质'
            rules={[{ required: true, message: '请选择群组性质' }]}>
            {renderSelect('groupType')}
          </Form.Item>
          <Form.Item name='leader' label='组长'>
            {leader && (
              <Tag
                color='geekblue'
                closable
                onClose={() => {
                  form.setFieldsValue({ leader: null });
                  setLeader(undefined);
                }}>
                {leader?.leaderName}
              </Tag>
            )}
            <Button type='link' onClick={() => leaderModal.current?.setVisible(true)}>
              选择
            </Button>
          </Form.Item>
          <Form.Item
            name='member'
            label='成员'
            rules={[
              {
                required: true,
                message: '请选择成员',
                validator: (rule, val) => {
                  return getMembers().length ? Promise.resolve() : Promise.reject('请选择成员');
                },
              },
            ]}>
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
        tabs={['organization', 'student', 'parent']}
        onRef={(ref) => (modal.current = ref)}
        onOk={(data) => {
          form.setFieldsValue({ member: data });

          setAll(data);
        }}></SelectMemberModal>
      <SelectLeaderModal
        onRef={(ref) => (leaderModal.current = ref)}
        onOk={(leader) => {
          form.setFieldsValue({ leader });
          setLeader(leader);
        }}></SelectLeaderModal>
    </div>
  );
}
