import { useMap, useRequest } from 'ahooks';
import { Button, Empty, message, Modal, Row, Space } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import api from 'src/api';
import ImportExcelModal from 'src/components/importModal';
import PrivateComponent from 'src/components/PrivateComponent';
import useDownload from 'src/hook/useDownload';
import GT from 'types';
import BuildingFloorCard from './BuildingFloorCard';
import CreateFloorModal from './CreateFloor';
export default function BuildingFloorDetail(props: { id: number; onRefresh?: () => void }) {
  const { data: floors, loading, refresh } = useRequest(() => api.building.getFloors(props.id), {
    refreshDeps: [props.id],
  });
  const [edit, setEdit] = useState(false);
  const [floorMap, { set: setFloor, reset: resetFloor }] = useMap<number, boolean>(new Map());
  const [roomMap, { set: setRoom, reset: resetRoom }] = useMap<number, boolean>(new Map());
  const { download } = useDownload();
  const floorModal = useRef<GT.Modal.Ref>();
  const importModal = useRef<GT.Modal.Ref>();
  const onCreate = () => {
    floorModal.current?.setTitle('新增楼层');
    floorModal.current?.setVisible(true);
    floorModal.current?.form?.setFieldsValue({
      buildingId: props.id,
    });
  };
  const floorCards = useMemo(
    () =>
      floors?.map((floor) => (
        <BuildingFloorCard
          data={floor}
          edit={edit}
          onChange={({ floorIds, roomIds }) => {
            [...floorIds.entries()].map(([key, val]) => setFloor(key, val));
            [...roomIds.entries()].map(([key, val]) => setRoom(key, val));
          }}
          onRefresh={() => {
            refresh();
          }}></BuildingFloorCard>
      )),
    [edit, floors, props.onRefresh],
  );
  const onExport = () => {
    api.building.exportRoom(props.id).then(download);
  };
  const onBatchDelete = () => {
    const floorIds = [...floorMap.keys()].filter((key) => floorMap.get(key));
    const roomIds = [...roomMap.keys()].filter((key) => roomMap.get(key));
    if (!floorIds.length && !roomIds.length) {
      return message.warn('请选择删除对象！');
    }
    Modal.confirm({
      title: '确认删除选中的房间和楼层吗？',
      onOk: () => {
        api.building
          .deleteFloor({
            floorIds,
            roomIds,
          })
          .then(() => {
            message.success('删除成功');
            refresh();
            resetFloor();
            resetRoom();
          });
      },
    });
  };
  const onImport = () => {
    importModal.current?.setVisible(true);
    importModal.current?.setTitle('批量导入');
  };
  return (
    <div>
      <p>
        <b>楼层房间</b>
      </p>
      <PrivateComponent id={[188, 189, 190, 191]}>
        <p>
          <Row justify='space-between'>
            {edit ? (
              <Button type='primary' ghost onClick={onBatchDelete}>
                批量删除
              </Button>
            ) : (
              <Space>
                <PrivateComponent id={188}>
                  <Button type='primary' ghost onClick={onCreate}>
                    新增楼层
                  </Button>
                </PrivateComponent>
                <PrivateComponent id={189}>
                  <Button type='primary' ghost onClick={onImport}>
                    批量导入房间
                  </Button>
                </PrivateComponent>
                <PrivateComponent id={190}>
                  <Button type='primary' ghost onClick={onExport}>
                    数据导出
                  </Button>
                </PrivateComponent>
              </Space>
            )}
            <PrivateComponent id={191}>
              <Button type='link' onClick={() => setEdit(!edit)}>
                {edit ? '完成编辑' : '编辑状态'}
              </Button>
            </PrivateComponent>
          </Row>
        </p>
      </PrivateComponent>

      {!loading && !floors?.length ? <Empty /> : null}
      {!loading && floors?.length ? floorCards : null}
      <CreateFloorModal
        onRef={(ref) => (floorModal.current = ref)}
        onOk={() => {
          refresh();
        }}></CreateFloorModal>
      <ImportExcelModal
        type='building'
        buildingQuery={{ buildingId: props.id }}
        onRef={(ref) => (importModal.current = ref)}
        onOk={refresh}></ImportExcelModal>
    </div>
  );
}
