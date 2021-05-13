import React from 'react';
import { Badge, Space } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
interface AppItemProps {
  src?: string;
  name: string;
  count?: any;
}
export default function AppItem(props: AppItemProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p>
        <Badge count={props.count} offset={[-7, 7]}>
          <Avatar src={props.src} size={60}></Avatar>
        </Badge>
      </p>
      <span style={{ color: '#616266', fontSize: 13 }}>{props.name}</span>
    </div>
  );
}
