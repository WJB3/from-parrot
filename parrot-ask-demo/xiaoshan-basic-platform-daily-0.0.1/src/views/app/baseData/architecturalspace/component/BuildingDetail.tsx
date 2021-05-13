import { useRequest } from 'ahooks';
import { Button, Descriptions } from 'antd';
import React, { useRef } from 'react';
import api from 'src/api';
import PrivateComponent from 'src/components/PrivateComponent';
import useDictionary from 'src/hook/useDictionary';
import useMoment from 'src/hook/useMoment';
import GT from 'types';
import BuildingFloorDetail from './BuildingFloorDetail';
import CreateBuildingModal from './CreateBuilding';

interface Props {
  id: number;
}
export default function BuildingDetail(props: Props) {
  const { data: building, loading, refresh } = useRequest(() => api.building.get(props.id), {
    refreshDeps: [props.id],
  });
  const { renderText } = useDictionary();
  const { moment } = useMoment();
  const modal = useRef<GT.Modal.Ref>();
  const onEdit = () => {
    modal.current?.setTitle('编辑楼宇');
    modal.current?.setVisible(true);
    modal.current?.form?.setFieldsValue({
      ...building,
      deliveryTime: moment(building?.deliveryTime),
    });
  };
  return (
    <div>
      {/* 楼宇详情 */}
      <p>
        <Descriptions
          title={building?.name}
          bordered
          extra={
            <PrivateComponent id={187}>
              <Button type='link' onClick={onEdit}>
                编辑
              </Button>
            </PrivateComponent>
          }>
          <Descriptions.Item label='楼宇名称'>{building?.name}</Descriptions.Item>
          <Descriptions.Item label='建筑结构'>
            {building?.structure !== undefined && renderText('structure', building?.structure)}
          </Descriptions.Item>
          <Descriptions.Item label='创建人'>{building?.createdMan}</Descriptions.Item>
          <Descriptions.Item label='楼宇性质'>
            {building?.nature !== undefined && renderText('nature', building?.nature)}
          </Descriptions.Item>
          <Descriptions.Item label='交付日期'>{building?.deliveryTime}</Descriptions.Item>
          <Descriptions.Item label='创建日期'>{building?.createdTime}</Descriptions.Item>
          <Descriptions.Item label='楼宇面积'>{building?.area} m²</Descriptions.Item>
          <Descriptions.Item label='楼宇序号'>{building?.sort}</Descriptions.Item>
        </Descriptions>
      </p>
      <CreateBuildingModal
        onRef={(ref) => (modal.current = ref)}
        onOk={refresh}></CreateBuildingModal>
      <BuildingFloorDetail id={props.id} onRefresh={refresh}></BuildingFloorDetail>
    </div>
  );
}
