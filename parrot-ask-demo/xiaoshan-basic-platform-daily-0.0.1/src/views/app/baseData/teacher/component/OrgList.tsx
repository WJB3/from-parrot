import React, { useRef, useState } from 'react';
import { Space, Button, Table, Popconfirm, message, Modal, Row } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import CreateOrgModal from './CreateOrg';

import GT from 'types';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import api from 'src/api';
import appStyle from 'src/App.style';
import constant from 'src/constant';
import { ColumnType } from 'antd/es/table/interface';
import { DataNode } from 'antd/lib/tree';
import PrivateComponent from 'src/components/PrivateComponent';

interface OrgListProps {
  /**
   * 是否传id会影响组件展示，
   * 存在id时获取全部数据展示，并且增加按钮切换显示全部或者5条
   * 不存在id时分页展示数据
   */
  id?: number;
  node?: GT.Model.Organization|null;
  orgTree: GT.Model.Organization[];
  onRefresh?: Function;
}
export default function OrgList(props: OrgListProps) {
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: Object) =>
    api.organization.getPage({
      params: {
        parentId: props.id,
        current: props.id ? null : current,
        size: props.id ? null : size,
        ...formData,
      },
    });

  const { tableProps, search, refresh } = useAntdTable(getTableData, { refreshDeps: [props.id] });
  const { submit } = search;
  const [rows, setRows] = useState<GT.Model.Organization[]>([]);
  const [collapsed, setCollapsed] = useState(true);
  const modal = useRef<GT.Modal.Ref>();
  const onCreate = () => {
    modal.current?.setTitle('新增部门');
    modal.current?.setDisabled(!!props.id);
    api.organization
      .getMaxSort({
        departmentId: props.id,
      })
      .then((res) => {
        modal.current?.form?.setFieldsValue({
          sort: Math.min(999, res + 1),
          type: props.id ? 2 : undefined,
          parentId: props.id,
        });
        modal.current?.setFormData({
          sort: Math.min(999, res + 1),
          type: props.id ? 2 : undefined,
          parentId: props.id,
        });
      });
    modal.current?.setVisible(true);
  };
  const onEdit = (record: GT.Model.Organization) => {
    record.parentId = record.parentId || props.id;
    modal.current?.setTitle('编辑部门');
    modal.current?.setVisible(true);
    modal.current?.form?.setFieldsValue(record);
    modal.current?.setFormData(record);
    modal.current?.setDisabled(false);
  };
  const onDelete = (records: GT.Model.Organization[]) => {
    if (records.some((record) => record.count)) {
      Modal.confirm({
        title: '部门人数不为0，请先移除部门内人员，再删除部门。',
      });
    } else {
      Modal.confirm({
        title: '删除后将无法恢复，确认删除该部门吗？',
        onOk: () => {
          api.organization.delete({ data: records.map((record) => record.id) }).then(() => {
            message.success('删除成功');
            submit();
            props.onRefresh?.();
          });
        },
      });
    }
  };
  const columns: ColumnType<GT.Model.Organization>[] = [
    {
      title: '部门序号',
      dataIndex: 'sort',
      render: (text, record, index) => index,
      fixed: true,
      width: 100,
    },
    {
      title: '部门名称',
      dataIndex: 'name',
    },
    {
      title: '部门类型',
      dataIndex: 'type',
      render: (type) => constant.organization.type.get(type),
    },
    {
      title: '部门人数',
      dataIndex: 'count',
    },
    {
      title: '操作',
      dataIndex: 'defaultState',
      fixed: 'right',
      width: 250,
      render: (defaultState, record) =>
        !defaultState && (
          <Space>
            <PrivateComponent id={props.id ? 229 : 235}>
              <Button type='link' size='small' onClick={() => onEdit(record)}>
                编辑
              </Button>
            </PrivateComponent>
            <PrivateComponent id={props.id ? 230 : 236}>
              <Button type='link' danger size='small' onClick={() => onDelete([record])}>
                删除
              </Button>
            </PrivateComponent>
          </Space>
        ),
    },
  ];
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.Organization[]) => {
    setRows(selectedRows);
  };
  const dataSource =
    props.id && collapsed ? tableProps.dataSource.slice(0, 5) : tableProps.dataSource;
  return (
    <div>
      {props.id && (
        <p>
          <b>部门列表</b>
        </p>
      )}

      {props.node?.defaultState === 1 ? null : (
        <PrivateComponent id={props.id ? [227, 228] : [233, 234]}>
          <p>
            <Space>
              <PrivateComponent id={props.id ? 227 : 233}>
                <Button type='primary' ghost onClick={onCreate}>
                  新增部门
                </Button>
              </PrivateComponent>
              <PrivateComponent id={props.id ? 228 : 234}>
                <Button type='primary' ghost disabled={!rows.length} onClick={() => onDelete(rows)}>
                  批量删除
                </Button>
              </PrivateComponent>
            </Space>
          </p>
        </PrivateComponent>
      )}

      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        pagination={props.id ? false : tableProps.pagination}
        dataSource={dataSource}
        rowSelection={{
          type: 'checkbox',
          onChange,
          selectedRowKeys: rows.map((item) => item.id),
          getCheckboxProps: (record) => {
            return {
              disabled: record.defaultState === 1,
            };
          },
        }}
        scroll={{ scrollToFirstRowOnChange: true,y:300 }}
      />
      <p>
        {props.id && tableProps.dataSource.length > 5 && (
          <Row justify='center'>
            <Button type='link' onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? '查看更多' : '收起'}
              <DoubleRightOutlined
                style={{
                  transform: `rotate(90deg) ${collapsed ? '' : 'rotateY(180deg)'}`,
                  transition: 'all cubic-bezier(.645,.045,.355,1) .3s',
                }}
              />
            </Button>
          </Row>
        )}
      </p>
      <CreateOrgModal
        onRef={(ref) => (modal.current = ref)}
        orgTree={props.orgTree}
        onOk={() => {
          refresh();
          props.onRefresh?.();
        }}
      />
    </div>
  );
}
