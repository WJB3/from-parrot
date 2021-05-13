import { Card, Col, Row } from 'antd';
import React, { useRef } from 'react';
import GT from 'types';
import Chart from './Chart';

export default function CharGroup(props: {item: GT.Model.LeaveSummary}) {
  const model = props.item;
  const fixedNumber = (num: number, total: number) => {
    return Number(Math.floor(num * 10000 / total) / 10000).toFixed(4);
  };

  const total1 = model.eventLeave + model.intervalExercises + model.sickLeave;
  let data1: any;
  if (total1 == 0) {
     data1 = [{'percentage': 0, 'type': '事假'}, {'percentage': 0, 'type': '病假'}, {'percentage': 0, 'type': '课间操'}]
  } else {
    data1 = [{'percentage': fixedNumber(model.eventLeave, total1), 'type': '事假', 'num': model.eventLeave}, {'percentage': fixedNumber(model.sickLeave, total1), 'type': '病假', 'num': model.sickLeave}, {'percentage': fixedNumber(model.intervalExercises, total1), 'type': '课间操', 'num': model.intervalExercises}]  
  }

  const total2 = model.commLeave + model.cycleLeave;
  let data2: any;
  if (total2 == 0 ) {
    data2 = [{'percentage': 0, 'type': '临时请假'}, {'percentage': 0, 'type': '周期请假'}]
  } else {
    data2 = [{'percentage': fixedNumber(model.commLeave, total2), 'type': '临时请假', 'num': model.commLeave}, {'percentage': fixedNumber(model.cycleLeave, total2), 'type': '周期请假', 'num': model.cycleLeave}]  
  }
  
  const total3 = model.eventLeaveReason + model.loneTermSickReason + model.temporarySickReason + model.physiologicalPeriodReason;
  let data3: any;
  if (total3 == 0) {
    data3 = ['事假', '长期病假', '临时病假', '生理期假'].map((e) => {return {'percentage': 0, 'type': e}});
  } else {
    data3 = [{'percentage': fixedNumber(model.eventLeaveReason, total3), 'type': '事假', 'num': model.eventLeaveReason}, 
              {'percentage': fixedNumber(model.loneTermSickReason, total3), 'type': '长期病假', 'num': model.loneTermSickReason}, 
              {'percentage': fixedNumber(model.temporarySickReason, total3), 'type': '临时病假', 'num': model.temporarySickReason},
              {'percentage': fixedNumber(model.physiologicalPeriodReason, total3), 'type': '生理期假', 'num': model.physiologicalPeriodReason}];
  }

  const total4 = model.residentStudent + model.generalStudent;
  let data4: any;
  if (total4 == 0) {
    data4 = [{'percentage': 0, 'type': '通校生'}, {'percentage': 0, 'type': '住校生'}];
  } else {
    data4 = [{'percentage': fixedNumber(model.generalStudent, total4), 'type': '通校生', 'num': model.generalStudent}, {'percentage': fixedNumber(model.residentStudent, total4), 'type': '住校生', 'num': model.residentStudent}];
  }
  
  return (
    <div>
      <p>
        <Row gutter={24}>
          <Col span={6}>
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 10 }}>
              <Chart title='请假类型' tips="单位：人" dataSource={data1}></Chart>
            </Card>
          </Col>
          <Col span={6}>
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 10 }}>
              <Chart title='请假周期' tips="单位：人" dataSource={data2}></Chart>
            </Card>
          </Col>
          <Col span={6}>
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 10 }}>
              <Chart title='课间操请假事由' tips="单位：人" dataSource={data3}></Chart>
            </Card>
          </Col>
          <Col span={6}>
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 10 }}>
              <Chart title='住校情况' tips="单位：人" dataSource={data4}></Chart>
            </Card>
          </Col>
        </Row>
      </p>
    </div>
  );
}