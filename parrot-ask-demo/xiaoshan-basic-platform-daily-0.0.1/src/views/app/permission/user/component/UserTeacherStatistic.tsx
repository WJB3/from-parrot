import { Card, Col, Row } from 'antd';
import React from 'react';
import IconFont from 'src/components/IconFont';
import GT from 'types';
const style: GT.Model.Style = {
  card: {
    borderRadius: 10,
    borderColor: '#E8ECEF',
  },
  icon: {
    fontSize: 55,
    marginRight: 30,
  },
  value: {
    fontSize: 26,
  },
  label: {
    fontSize: 12,
    color: '#616266',
  },
};
export default function UserTeacherStatistic(props: GT.Model.UserTeacherStatistic) {
  return (
    <Row gutter={30}>
      <Col span={8}>
        <Card style={style.card}>
          <Row align='middle'>
            <IconFont type='iconicon1' style={style.icon}></IconFont>
            <div>
              <div style={{ ...style.value, color: '#387DFF' }}>{props.totalCount}</div>
              <span style={style.label}>总人数</span>
            </div>
          </Row>
        </Card>
      </Col>
      <Col span={8}>
        <Card style={style.card}>
          <Row align='middle'>
            <IconFont type='iconicon2' style={style.icon}></IconFont>
            <div>
              <div style={{ ...style.value, color: '#6DD230' }}> {props.activeCount}</div>
              <span style={style.label}>已激活人数</span>
            </div>
          </Row>
        </Card>
      </Col>
      <Col span={8}>
        <Card style={style.card}>
          <Row align='middle'>
            <IconFont type='iconiocn3' style={style.icon}></IconFont>
            <div>
              <div style={{ ...style.value, color: '#FE7C4B' }}>{props.todayLoginCount}</div>
              <span style={style.label}>今日登录人数</span>
            </div>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
