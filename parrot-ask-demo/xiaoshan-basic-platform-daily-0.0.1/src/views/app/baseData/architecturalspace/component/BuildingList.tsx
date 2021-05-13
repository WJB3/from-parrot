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
import CreateBuildingModal from './CreateBuilding';
export default function BuildingList(props: {
  campusId: number;
  onRefresh?: () => void;
  onCheck?: (record: GT.Model.Building) => void;
}) {
  const { data: chartData } = useRequest(() => api.building.getBuildingStatistic(props.campusId), {
    refreshDeps: [props.campusId],
  });
  const { renderText } = useDictionary();
  const modal = useRef<GT.Modal.Ref>();
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    return api.building.getBuildingPage(props.campusId, {
      params: {
        ...formData,
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
      title: '楼宇编号',
      dataIndex: 'sort',
      align: 'center',
    },
    {
      title: '楼宇名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '楼宇性质',
      dataIndex: 'nature',
      render: (nature) => renderText('nature', nature),
      align: 'center',
    },
    {
      title: '楼宇面积(m²)',
      dataIndex: 'area',
      align: 'center',
    },
    {
      title: '建筑结构',
      dataIndex: 'structure',
      render: (structure) => renderText('structure', structure),
      align: 'center',
    },
    {
      title: '交付日期',
      dataIndex: 'deliveryTime',
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
        <PrivateComponent id={186}>
          <Button type='link' onClick={() => onCheck(record)}>
            查看
          </Button>
        </PrivateComponent>
      ),
    },
  ];
  const onCheck = (record: GT.Model.Building) => {
    props.onCheck?.(record);
  };
  const onCreate = () => {
    api.building
      .getMaxSort({
        campusId: props.campusId,
        type: 1,
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
          <Col span={8}>
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 10 }}>
              <Chart title='楼宇数量' dataSource={chartData?.buildingNum || []}></Chart>
            </Card>
          </Col>
          <Col span={8}>
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 10 }}>
              <Chart title='楼宇面积' dataSource={chartData?.buildingArea || []}></Chart>
            </Card>
          </Col>
          <Col span={8}>
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 10 }}>
              <Chart title='建筑结构' dataSource={chartData?.structure || []}></Chart>
            </Card>
          </Col>
        </Row>
      </p>
      <PrivateComponent id={185}>
        <p>
          <Button type='primary' ghost onClick={onCreate}>
            新增楼宇
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
      <CreateBuildingModal
        onRef={(ref) => (modal.current = ref)}
        onOk={() => {
          refresh();
          props.onRefresh?.();
        }}></CreateBuildingModal>
    </div>
  );
}
