import React, { useState, useRef, useEffect } from 'react';
import GT from 'types';
import { Form, Table, Modal, Space, Button, Select, message, Row, Input, TreeSelect } from 'antd';
import constant from 'src/constant';
import PrivateComponent from 'src/components/PrivateComponent';
import api from 'src/api';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useRequest } from 'ahooks';
import { TreeNode } from 'antd/lib/tree-select';
import SelectMemberModal from 'src/components/selectMember';

export default function ReceivePersonModal(props: GT.Modal.Props&{taskId?:number}) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('接收对象详情');
  const [loading, setLoading] = useState(false);
  const selectModal = useRef<GT.Modal.Ref>();
  const [teaschers, setTeaschers] = useState<GT.Model.Teacher[]>()
  const [canDelete, setCanDelete] = useState(true);
 
  const [form] = Form.useForm();
  const { data: treeData } = useRequest(api.organization.getAll);

  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) =>
  props.taskId && api.award.getReceivePage({
    ...formData,
    taskId:props.taskId,
    current,
    size,
  });

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
    refreshDeps:[props.taskId]
  });
  const { submit, reset } = search;

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  const renderTreeNode = (data: GT.Model.Organization[]) => {
    return data.map((item) => (
      <TreeNode
        value={item.id}
        title={item.name}
        selectable={item.type === 2}
        disabled={item.type === 1}>
        {item.departments && renderTreeNode(item.departments)}
      </TreeNode>
    ));
  };

  props.onRef({
    setVisible,
    setTitle,
    setCanDelete,
    form: form,
  });

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
    reset();
    props.onOk && props.onOk();
  };
  const columns: ColumnType<GT.Model.Teacher>[] = [
    {
      title: '序号',
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) =>
        <Space>
          <PrivateComponent id={380}>
            <Button type='link' danger
              disabled={!canDelete}
              onClick={() => onDelete(record)}>
              删除
            </Button>
          </PrivateComponent>
        </Space>
        
    },
  ];
  const onDelete = (record: GT.Model.Teacher) => {
    // 删除任务对象
    Modal.confirm({
      title: '确认删除当前人员吗？',
      onOk() {
        api.award.deleteReceivers(props.taskId!, [record.id]).then(() => {
          message.success('删除成功');
          refresh();
          // search.reset();
        });
      },
    });
  };

  const onSubmit = (data: Map<string, any>) => {
    const teacherIds = [...data.values()].reduce((arr, item) => {
      arr = arr.concat(item.nodes.map((t: any) => t.id || t.memberId));
      return arr;
    }, []);
    api.award
      .addReceivers(
        props.taskId!,
        Array.from(new Set(teacherIds)),
      )
      .then(() => {
        message.success('操作成功');
        refresh();
      });

  };

  return (
    <div>
      <Modal
        width={1000}
        title={title}
        visible={visible}
        onOk={handleCancel}
        onCancel={handleCancel}
        afterClose={handleCancel}
        confirmLoading={loading}
        footer={
          []
        }>
        <Form
          className='search_form'
          preserve={false}
          form={form}
          // initialValues={{}}
          {...constant.form.layout}>
          <Row>
            <Row className='search_form_items'>
            <Form.Item name='departmentIds' label='部门'>
              <TreeSelect
                showSearch
                treeNodeFilterProp={'title'}
                placeholder='请选择'>
                {renderTreeNode(treeData || [])}
              </TreeSelect>
              </Form.Item>
              <Form.Item label='姓名' name='name'>
                <Input placeholder='请输入' />
              </Form.Item>
            </Row>
            <Form.Item>
              <Space>
                <Button type='primary' onClick={submit}>
                  搜索
                </Button>
                <Button onClick={reset}>清空</Button>
              </Space>
            </Form.Item>
          </Row>
          <p>
            {canDelete ? (
              <Space>
                <Button type='primary' ghost
                onClick={() => {
                  selectModal.current?.setVisible(true);
                  selectModal.current?.setMembers(new Map());
                }}>
                  添加接收对象
                </Button>
              </Space>
            ) : null}
          </p>
        </Form>
        <Table style={appStyle.table}
              columns={columns}
              rowKey='id'
              {...tableProps}
              size='small'/>
      </Modal>
      <SelectMemberModal
        tabs={['organization', 'group' ]}
        customQuery={{propertyType: 0}}
        onRef={(ref) => (selectModal.current = ref)}
        onOk={onSubmit}></SelectMemberModal>
    </div>
  );
}
