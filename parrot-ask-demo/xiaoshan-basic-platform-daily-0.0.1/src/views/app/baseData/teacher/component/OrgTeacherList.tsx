import React, { useRef, useState } from 'react';
import GT from 'types';
import { Space, Button, Table, Modal, message, Dropdown, Menu } from 'antd';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';

import api from 'src/api';
import { ColumnType } from 'antd/es/table/interface';
import constant from 'src/constant';
import appStyle from 'src/App.style';
import useDictionary from 'src/hook/useDictionary';
import useDownload from 'src/hook/useDownload';
import { Store } from 'antd/lib/form/interface';
import CreateTeacherModal from './CreateTeacher';
import SelectMemberModal from 'src/components/selectMember';
import PrivateComponent from 'src/components/PrivateComponent';
import OneLineText from 'src/components/OneLineText';
interface OrgTeacherListProps {
  node: GT.Model.Organization;
  orgTree: GT.Model.Organization[];
}
export default function OrgTeacherList(
  props: OrgTeacherListProps & { onRef?: (ref: any) => void; onRefresh?: () => void },
) {
  const { node } = props;
  const { renderText } = useDictionary();
  const [rows, setRows] = useState<GT.Model.Teacher[]>([]);
  const { download } = useDownload();
  const modal = useRef<GT.Modal.Ref>();
  const selectModal = useRef<GT.Modal.Ref>();
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: Object) =>
    api.organization.getTeacherPage(node.id, {
      params: {
        current,
        size,
        ...formData,
      },
    });

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    refreshDeps: [node],
  });
  const { submit } = search;
  props.onRef?.({
    refresh,
  });

  


  const diffComuns: ColumnType<GT.Model.Teacher>[] =
    props.node.type === 2
      ? [
        {
          title: '职位',
          dataIndex: 'position',
          render: (val) => val || '成员',
        },
      ]
      : [
        {
          title: '部门',
          dataIndex: 'departmentName',
          render: (val) => <OneLineText>{val}</OneLineText>,
        },
      ];


  const columns: ColumnType<GT.Model.Teacher>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
    },
    {
      title: '职工号',
      dataIndex: 'employeeNo',
    },
    {
      title: 'IC卡号',
      dataIndex: 'icCardNo',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (val) => renderText('gender', val),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '编制',
      dataIndex: 'budgetedPost',
      render: (val) => renderText('budgetedPost', val),
    },
    ...diffComuns,
    {
      title: '操作',
      fixed: 'right',
      width: 250,
      align: 'center',
      render: (text, record) => (
        <Space>
          <PrivateComponent id={node.type !== 1 ? 252 : 239}>
            <Button
              type='link'
              onClick={() => {
                message.info('该功能暂未开通，敬请期待');
              }}>
              教师档案
            </Button>
          </PrivateComponent>
          <PrivateComponent id={node.type !== 1 ? 250 : 240}>
            <Button type='link' onClick={() => onEdit(record)}>
              编辑
            </Button>
          </PrivateComponent>
          <PrivateComponent id={node.type !== 1 ? 251 : 241}>
            <Button type='link' danger onClick={() => onDelete([record])}>
              移除
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
  const onCreate = () => {
    modal.current?.setTitle('新增教师');
    modal.current?.setVisible(true);
  };
  const onEdit = (value: Store) => {
    modal.current?.setVisible(true);
    modal.current?.setTitle('编辑教师');
    modal.current?.form?.setFieldsValue(value);
  };
  const onDelete = (records: GT.Model.Teacher[]) => {
    Modal.confirm({
      title: '确认从部门中移除教师吗？',
      onOk: () => {
        api.organization
          .deleteTeachers({
            data: records.map((record) => ({
              teacherId: record.id,
              departmentIds: record.departmentIds,
            })),
          })
          .then(() => {
            message.success('移除成功');
            submit();
            props.onRefresh?.();
          });
      },
    });
  };
  const onExport = () => {
    api.teacher
      .export({
        departmentIds: props.node.id,
        singleDepartment: true,
      })
      .then((res) => {
        download(res);
      });
  };
  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.Teacher[]) => {
    setRows(selectedRows);
  };
  const onSelect = () => {
    selectModal.current?.setVisible(true);
    selectModal.current?.setMembers(new Map());
  };
  const onSubmit = (data: Map<string, any>) => {
    const teacherIds = [...data.values()].reduce((arr, item) => {
      arr = arr.concat(item.nodes.map((t: any) => t.id || t.memberId));
      return arr;
    }, []);
    api.organization
      .selectTeachers({
        teacherIds: Array.from(new Set(teacherIds)),
        departmentId: props.node.id,
      })
      .then(() => {
        message.success('操作成功');
        refresh();
      });
  };
  return (
    <div>
      <p>
        <b>{node.type === 1 ? '部门组成员列表' : '部门成员列表'}</b>
      </p>
      <PrivateComponent id={node.type !== 1 ? [246, 247, 248, 249] : [237, 238]}>
        <p>
          <Space>
            {node.type !== 1 && node.defaultState !== 1 && (
              <PrivateComponent id={246}>
                <Button type='primary' ghost onClick={onCreate}>
                  新增教师
                </Button>
              </PrivateComponent>
            )}
            {node.type !== 1 && node.defaultState !== 1 && (
              <PrivateComponent id={247}>
                <Button type='primary' ghost onClick={onSelect}>
                  选取加入
                </Button>
              </PrivateComponent>
            )}
            <PrivateComponent id={node.type !== 1 ? 248 : 237}>
              <Button type='primary' ghost onClick={onExport}>
                数据导出
              </Button>
            </PrivateComponent>
            <PrivateComponent id={node.type !== 1 ? 249 : 238}>
              <Button type='primary' ghost onClick={() => onDelete(rows)} disabled={!rows.length}>
                批量移除
              </Button>
            </PrivateComponent>
          </Space>
          
        </p>
      </PrivateComponent>

      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        rowSelection={{ type: 'checkbox', onChange, selectedRowKeys: rows.map((item) => item.id) }}
        scroll={{ scrollToFirstRowOnChange: true, x: 1300 }}
      />
      <CreateTeacherModal
        onRef={(ref) => (modal.current = ref)}
        onOk={() => {
          refresh();
          props.onRefresh?.();
        }}
        node={props.node}
        orgTree={props.orgTree || []}
      />
      <SelectMemberModal
        onRef={(ref) => (selectModal.current = ref)}
        onOk={onSubmit}
        tabs={['organization', 'group']}
        groupType='lesson'></SelectMemberModal>
    </div>
  );
}
