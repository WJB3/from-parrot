import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  InputNumber,
  message,
  Modal,
  Row,
  Space,
  Tag,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import GT from 'types';
import BuildingRoomCard from './BuildingRoomCard';
import CreateRoomModal from './CreateRoom';
import { DeleteFilled } from '@ant-design/icons';
import api from 'src/api';
import { useMap } from 'ahooks';
import PrivateComponent from 'src/components/PrivateComponent';
export default function BuildingFloorCard(props: {
  data: GT.Model.BuildingFloor;
  edit?: boolean;
  onRefresh?: () => void;
  onChange?: (data: { floorIds: Map<number, boolean>; roomIds: Map<number, boolean> }) => void;
}) {
  const { data: floor } = props;
  const modal = useRef<GT.Modal.Ref>();
  // room checked map
  const [map, { set, get }] = useMap<number, boolean>([]);
  const [level, setLevel] = useState(floor.level);
  const [checked, setChecked] = useState(false);
  const onChange = (floorChecked: boolean) => {
    props.onChange?.({
      floorIds: new Map([[floor.id, floorChecked]]),
      roomIds: map,
    });
  };
  const title = (
    <Space size='large' style={{ padding: '4px 0', color: '#616266', fontSize: 13 }}>
      {props.edit && (
        <Checkbox
          style={{ marginLeft: 10 }}
          onChange={(e) => {
            // if (e.target.checked) {
            //   floor.list?.map((room) => set(room.id, e.target.checked));
            // }
            setChecked(e.target.checked);
            onChange(e.target.checked);
          }}></Checkbox>
      )}
      {props.edit ? (
        <Space>
          <InputNumber
            defaultValue={floor.level}
            precision={0}
            onChange={(val) => setLevel(Number(val))}
            onPressEnter={(e) => {
              api.building.updateFloor({ id: floor.id, level }).then(() => {
                message.success('编辑成功');
                props.onRefresh?.();
              });
            }}></InputNumber>
          层
        </Space>
      ) : (
        <Tag color='#23B899' style={{ paddingRight: 10, borderRadius: '0px 10px 10px 0px' }}>
          {floor.level}层
        </Tag>
      )}
      <span>面积： {floor.area}m²</span>
      <span>房间： {floor.num}间</span>
    </Space>
  );
  const onCreate = () => {
    modal.current?.setVisible(true);
    modal.current?.form?.setFieldsValue({
      floorId: floor.id,
    });
  };
  const onRoomEdit = (room: GT.Model.BuildingRoom) => {
    modal.current?.setTitle('编辑房间');
    modal.current?.setVisible(true);
    modal.current?.form?.setFieldsValue({
      ...room,
      floorId: floor.id,
    });
  };
  const onDelete = () => {
    Modal.confirm({
      title: '确认删除该楼层吗？',
      onOk: () => {
        api.building.deleteFloor({ floorIds: [floor.id] }).then(() => {
          message.success('删除成功');
          props.onRefresh?.();
        });
      },
    });
  };
  const onRoomDelete = (room: GT.Model.BuildingRoom) => {
    Modal.confirm({
      title: '确认删除该房间吗？',
      onOk: () => {
        api.building.deleteFloor({ roomIds: [room.id] }).then(() => {
          message.success('删除成功');
          props.onRefresh?.();
        });
      },
    });
  };
  const roomCards = useMemo(
    () =>
      floor.list?.map((room, index) => (
        <Col span={6}>
          <BuildingRoomCard
            edit={props.edit}
            data={room}
            checked={get(room.id)}
            onChange={(room, roomChecked) => {
              set(room.id, roomChecked);
              onChange(checked);
            }}
            onDelete={() => onRoomDelete(room)}
            onEdit={() => onRoomEdit(room)}></BuildingRoomCard>
        </Col>
      )),
    [floor, props.edit, map, checked],
  );

  return (
    <Card
      title={title}
      size='small'
      extra={
        props.edit ? (
          <Space>
            <Button icon={<DeleteFilled />} type='link' danger onClick={onDelete}></Button>
          </Space>
        ) : (
          <PrivateComponent id={194}>
            <Button type='primary' style={{ marginRight: 10 }} onClick={onCreate}>
              新增房间
            </Button>
          </PrivateComponent>
        )
      }
      headStyle={{ background: 'rgba(184, 196, 230, .2)', padding: 0 }}>
      {floor.num ? <Row gutter={[10, 10]}>{roomCards}</Row> : <Empty />}
      <CreateRoomModal
        onRef={(ref) => (modal.current = ref)}
        onOk={() => {
          props.onRefresh?.();
        }}></CreateRoomModal>
    </Card>
  );
}
