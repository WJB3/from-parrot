import { useRequest } from 'ahooks';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { Button, Card, Col, Row, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import React, { useRef } from 'react';
import api from 'src/api';
import appStyle from 'src/App.style';
import PrivateComponent from 'src/components/PrivateComponent';
import constant from 'src/constant';
import useDictionary from 'src/hook/useDictionary';
import GT from 'types';
import Chart from './Chart';
import CreateSpaceModal from './CreateSpace';
export default function SpaceList(props: {
  campusId: number;
  onRefresh?: () => void;
  onCheck?: (record: GT.Model.Building) => void;
}) {
  const { data: chartData, refresh: refreshChart } = useRequest(
    () => api.building.getSpaceStatistic(props.campusId),
    {
      refreshDeps: [props.campusId],
    },
  );
  const { renderText } = useDictionary();
  const modal = useRef<GT.Modal.Ref>();
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    return api.building.getSpacePage({
      params: {
        ...formData,
        campusId: props.campusId,
        current,
        size,
      },
    });
  };

  const { tableProps, refresh } = useAntdTable(getTableData, {
    refreshDeps: [props.campusId],
  });
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  const columns: ColumnType<GT.Model.Building>[] = [
    {
      title: '空间序号',
      dataIndex: 'sort',
      align: 'center',
    },
    {
      title: '空间名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '空间性质',
      dataIndex: 'type',
      render: (spaceType) => renderText('spaceType', spaceType),
      align: 'center',
    },
    {
      title: '空间面积(m²)',
      dataIndex: 'area',
      align: 'center',
    },

    {
      title: '创建人',
      dataIndex: 'createdMan',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <PrivateComponent id={183}>
          <Button type='link' onClick={() => onEdit(record)}>
            编辑
          </Button>
        </PrivateComponent>
      ),
    },
  ];
  const onEdit = (record: GT.Model.Building) => {
    modal.current?.setVisible(true);
    modal.current?.setTitle('编辑室外空间');
    modal.current?.form?.setFieldsValue({ ...record, campusId: props.campusId });
  };
  const onCreate = () => {
    modal.current?.setTitle('新增室外空间');
    api.building
      .getMaxSort({
        campusId: props.campusId,
        type: 2,
      })
      .then((sort) => {
        modal.current?.setVisible(true);
        modal.current?.form?.setFieldsValue({ campusId: props.campusId, sort });
      });
  };
  return (
    <div>
      <p>
        <Row gutter={20}>
          <Col span={12}>
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 10 }}>
              <Chart title='空间数量' dataSource={chartData?.spaceNum || []}></Chart>
            </Card>
          </Col>
          <Col span={12}>
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 10 }}>
              <Chart title='空间面积' dataSource={chartData?.spaceArea || []}></Chart>
            </Card>
          </Col>
        </Row>
      </p>
      <PrivateComponent id={182}>
        <p>
          <Button type='primary' ghost onClick={onCreate}>
            新增室外空间
          </Button>
        </p>
      </PrivateComponent>

      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        size='small'
        scroll={{ scrollToFirstRowOnChange: true }}
      />
      <CreateSpaceModal
        onRef={(ref) => (modal.current = ref)}
        onOk={() => {
          refresh();
          refreshChart();
          props.onRefresh?.();
        }}></CreateSpaceModal>
    </div>
  );
}
