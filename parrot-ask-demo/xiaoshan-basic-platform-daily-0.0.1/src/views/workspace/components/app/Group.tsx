import React from 'react';
import { Card, Row, Col } from 'antd';
import GT from 'types';
import AppItem from 'src/components/AppItem';
interface AppGroupProps {
  data: GT.Model.Menu[];
  title: String;
  extra?: any;
  count?: any;
  onClick?: (data: any, index: number) => void;
}
export default function AppGroup(props: AppGroupProps) {
  return (
    <Card
      title={props.title}
      bordered={false}
      extra={props.extra}
      headStyle={{ border: 'none' }}
      bodyStyle={{ padding: '0 24px' }}>
      <Row gutter={[60, 30]}>
        {props.data.map((d, i) => (
          <Col onClick={() => props.onClick && props.onClick(d, i)}>
            <AppItem src={d.iconUrl} name={d.zhName} count={props.count(d)}></AppItem>
          </Col>
        ))}
      </Row>
    </Card>
  );
}

AppGroup.defaultProps = {
  edit: true,
};
