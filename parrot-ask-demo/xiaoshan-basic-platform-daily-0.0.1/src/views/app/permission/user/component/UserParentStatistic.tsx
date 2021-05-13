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
export default function UserParentStatistic(props: GT.Model.UserParentStatistic) {
  return (
    <Row gutter={30}>
      <Col span={6}>
        <Card style={style.card}>
          <Row align='middle'>
            <IconFont type='iconicon4' style={style.icon}></IconFont>
            <div>
              <div style={{ ...style.value, color: '#387DFF' }}>{props.studentCount}</div>
              <span style={style.label}>学生人数</span>
            </div>
          </Row>
        </Card>
      </Col>
      <Col span={6}>
        <Card style={style.card}>
          <Row align='middle'>
            <IconFont type='iconicon5' style={style.icon}></IconFont>
            <div>
              <div style={{ ...style.value, color: '#8978FF' }}>{props.parentCount}</div>
              <span style={style.label}>家长人数</span>
            </div>
          </Row>
        </Card>
      </Col>
      <Col span={6}>
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
      <Col span={6}>
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
