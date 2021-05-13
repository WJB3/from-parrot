import React, { useEffect, useRef, useState } from 'react';
import GT from 'types';
import { Space, Button, Table, Modal, message } from 'antd';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import api from 'src/api';
import { ColumnType } from 'antd/es/table/interface';
import constant from 'src/constant';
import appStyle from 'src/App.style';
import useDictionary from 'src/hook/useDictionary';
import useDownload from 'src/hook/useDownload';
import { Store } from 'antd/lib/form/interface';
import CreateServiceModal from './CreateServiceModal';
import SelectMemberModal from 'src/components/selectMember';
import PrivateComponent from 'src/components/PrivateComponent';
import OneLineText from 'src/components/OneLineText';
import { useRequest } from 'ahooks';
interface DepartmentServiceListProps {
  node: GT.Model.Organization;
  orgTree: GT.Model.Organization[];
  companyList: GT.Model.Company[];
}
export default function DepartmentServiceList(
  props: DepartmentServiceListProps & { onRef?: (ref: any) => void; onRefresh?: () => void },
) {
  const { node } = props;
  const { renderText } = useDictionary();
  const [rows, setRows] = useState<GT.Model.Service[]>([]);
  const { download } = useDownload();
  const modal = useRef<GT.Modal.Ref>();
  const selectModal = useRef<GT.Modal.Ref>();
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: Object) =>
    api.service.getDepartmentGroup(node.id, {
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

  const columns: ColumnType<GT.Model.Service>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
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
        title: '证件号码',
        dataIndex: 'idNo',
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
        title: '服务部门',
        dataIndex: 'departmentName',
        render: (val) => <OneLineText>{val}</OneLineText>,
    },
    {
        title: '所属公司',
        dataIndex: 'companyName',
    },
    {
      title: '操作',
      fixed: 'right',
      width: 250,
      align: 'center',
      render: (text, record) => (
        <Space>
          <PrivateComponent id={336}>
            <Button type='link' onClick={() => onEdit(record)}>
              编辑
            </Button>
          </PrivateComponent>
          <PrivateComponent id={337}>
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
    modal.current?.setTitle('新增服务人员');
    modal.current?.setVisible(true);
  };
  const onEdit = (value: Store) => {
    modal.current?.setVisible(true);
    modal.current?.setTitle('编辑服务人员');
    modal.current?.form?.setFieldsValue(value);
  };
  const onDelete = (records: GT.Model.Service[]) => {
    Modal.confirm({
      title: '确认把该成员从当前服务部门中移除吗？',
      onOk: () => {
        api.service
          .deleteDepartmentService({
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
    api.service
      .exportExcel({
        departmentIds: props.node.id,
        singleDepartment: true,
      })
      .then((res) => {
        download(res);
      });
  };
  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.Service[]) => {
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
    api.service
      .departmentSelectService({
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
        <b>部门成员列表</b>
      </p>
      <PrivateComponent id={[333, 334, 335, 342]}>
        <p>
          <Space>
            {node.type !== 1 && node.defaultState !== 1 && (
              <PrivateComponent id={333}>
                <Button type='primary' ghost onClick={onCreate}>
                  新增服务人员
                </Button>
              </PrivateComponent>
            )}
            {node.type !== 1 && node.defaultState !== 1 && (
              <PrivateComponent id={334}>
                <Button type='primary' ghost onClick={onSelect}>
                  选取加入
                </Button>
              </PrivateComponent>
            )}
            <PrivateComponent id={335}>
              <Button type='primary' ghost onClick={onExport}>
                数据导出
              </Button>
            </PrivateComponent>
            <PrivateComponent id={342}>
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
      <CreateServiceModal
        onRef={(ref) => (modal.current = ref)}
        onOk={() => {
          refresh();
          props.onRefresh?.();
        }}
        node={props.node}
        orgTree={props.orgTree || []}
        companyList={props.companyList || []}
      />
      <SelectMemberModal
        onRef={(ref) => (selectModal.current = ref)}
        onOk={onSubmit}
        tabs={['department']}></SelectMemberModal>
    </div>
  );
}
