import { Button, Checkbox, Row } from 'antd';
import React from 'react';
import GT from 'types';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import useDictionary from 'src/hook/useDictionary';
export default function BuildingRoomCard(props: {
  data: GT.Model.BuildingRoom;
  edit?: boolean;
  checked?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onChange?: (data: GT.Model.BuildingRoom, checked: boolean) => void;
}) {
  const { renderText } = useDictionary();
  return (
    <Row
      align='middle'
      justify='space-between'
      style={{
        padding: '10px 10px',
        fontSize: 12,
        background: '#5781F2',
        borderRadius: 3,
        color: '#fff',
      }}>
      {props.edit && (
        <Checkbox
          checked={props.checked}
          style={{ marginRight: 5, alignSelf: 'flex-start' }}
          onChange={(e) => {
            props.onChange?.(props.data, e.target.checked);
          }}></Checkbox>
      )}
      <div style={{ flex: 1 }}>
        <div>房间：{props.data.name}</div>
        <div>类型：{renderText('roomType', props.data.type)}</div>
        <div>面积：{props.data.area}m²</div>
      </div>
      {props.edit && (
        <div>
          <div>
            <Button
              size='small'
              icon={<EditFilled style={{ color: '#fff' }} />}
              type='link'
              onClick={props.onEdit}></Button>
          </div>
          <div>
            <Button
              size='small'
              icon={<DeleteFilled />}
              type='link'
              danger
              onClick={props.onDelete}></Button>
          </div>
        </div>
      )}
    </Row>
  );
}
