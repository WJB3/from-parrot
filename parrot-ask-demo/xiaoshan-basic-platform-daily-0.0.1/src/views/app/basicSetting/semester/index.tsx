import { useRequest } from 'ahooks';
import { Badge, Button, Space, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import React, { useRef } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import api from 'src/api';
import appStyle from 'src/App.style';
import PrivateComponent from 'src/components/PrivateComponent';
import constant from 'src/constant';
import useMoment from 'src/hook/useMoment';
import GT from 'types';
import CreateSemesterModal from './component/CreateSemester';
import InitSemesterModal from './component/InitSemester';
import SemesterCard from './component/SemesterCard';
import UpgradeLogModal from './component/UpgradeLog';
export default function SemesterPage(props: RouteComponentProps) {
  const { loading, data, refresh } = useRequest(api.semester.getAll);
  const { data: logs } = useRequest(() =>
    api.semester.getLogPage({ params: { current: -1, size: -1 } }),
  );
  const createModal = useRef<GT.Modal.Ref>();
  const initModal = useRef<GT.Modal.Ref>();
  const logModal = useRef<GT.Modal.Ref>();
  const card = useRef<any>();
  const { moment } = useMoment();
  const columns: ColumnType<GT.Model.Semester>[] = [
    {
      title: '学年',
      render: (text, record) => {
        return `${record.startYear}-${record.endYear}`;
      },
      align: 'center',
    },
    {
      title: '学期',
      dataIndex: 'orderNo',
      render: (orderNo) => constant.semester.orderNo.get(orderNo),
      align: 'center',
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      align: 'center',
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (state) => constant.semester.state.get(state),
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Space>
          <PrivateComponent id={281}>
            <Button
              type='link'
              onClick={() => {
                props.history.push(
                  `${props.location.pathname}/calendar/${record.state === 0 ? record.id : 0}`,
                );
              }}>
              校历
            </Button>
          </PrivateComponent>

          {record.state === 1 && (
            <PrivateComponent id={282}>
              <Button type='link' onClick={() => onEdit(record)}>
                编辑
              </Button>
            </PrivateComponent>
          )}
        </Space>
      ),
    },
  ];
  const onCreate = () => {
    if (data?.length) {
      api.semester.getNext().then((res) => {
        createModal.current?.form?.setFieldsValue({
          endYear: res.nextEndYear,
          orderNo: res.nextOrderNo,
          startYear: res.nextStartYear,
        });
        createModal.current?.setTitle('开启新学期');
        createModal.current?.setVisible(true);
      });
    } else {
      initModal.current?.setTitle('开启新学期');
      initModal.current?.setVisible(true);
    }
  };
  const onEdit = (record: GT.Model.Semester) => {
    createModal.current?.form?.setFieldsValue({
      ...record,
      date: [moment(record.startDate), moment(record.endDate)],
    });
    createModal.current?.setTitle('编辑');
    createModal.current?.setVisible(true);
  };
  return (
    <div>
      {data?.[0]?.id ? (
        <p>
          <SemesterCard
            id={data?.[0]?.id}
            onRef={(ref) => {
              card.current = ref;
            }}></SemesterCard>
        </p>
      ) : null}

      <p>
        <Space>
          <Button ghost type='primary' onClick={onCreate}>
            开启新学期
          </Button>
          <Badge dot={!!logs?.list.filter((item) => item.state === -1).length}>
            <Button
              type='link'
              onClick={() => {
                logModal.current?.setVisible(true);
              }}>
              操作记录
            </Button>
          </Badge>
        </Space>
      </p>
      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        loading={loading}
        dataSource={data}
        pagination={false}
        size='small'
        scroll={{ scrollToFirstRowOnChange: true }}
      />
      <CreateSemesterModal
        last={data?.[1]}
        onRef={(ref) => (createModal.current = ref)}
        onOk={() => {
          refresh();
          card.current?.refresh?.();
        }}></CreateSemesterModal>
      <InitSemesterModal
        onRef={(ref) => (initModal.current = ref)}
        onOk={() => {
          refresh();
          card.current?.refresh?.();
        }}></InitSemesterModal>
      <UpgradeLogModal onRef={(ref) => (logModal.current = ref)}></UpgradeLogModal>
    </div>
  );
}
