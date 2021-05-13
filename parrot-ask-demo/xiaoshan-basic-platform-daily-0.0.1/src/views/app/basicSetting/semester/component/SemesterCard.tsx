import { useRequest } from 'ahooks';
import { Col, Divider, Row, Space } from 'antd';

import React, { CSSProperties, useState } from 'react';
import api from 'src/api';
import constant from 'src/constant';
import useCalendar from 'src/hook/useCalendar';
import useMoment from 'src/hook/useMoment';
import GT from 'types';
const styles: {
  [key: string]: CSSProperties;
} = {
  label: {
    fontSize: 13,
    color: '#84878C',
    paddingLeft: 20,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  border: {
    borderLeft: '1px solid #C6C8CC',
  },
  circle: {
    display: 'inline-block',
    width: 16,
    height: 16,
    borderRadius: '50%',
    background: '#FF8948',
    marginRight: 5,
  },
};
export default function SemesterCard(props: { id?: number; onRef: (ref: any) => void }) {
  const [weeks, setWeeks] = useState<GT.Model.CalendarWeek[]>([]);
  const { moment } = useMoment();
  const { data: semester, refresh } = useRequest(
    () => (props.id ? api.semester.getById(props.id) : api.semester.getCurrent()),
    {
      onSuccess(res) {
        if (res) {
          api.calendar.getWeekConfig(res.id).then((wks) => {
            setWeeks(wks);
          });
        }
      },
    },
  );
  props.onRef?.({
    refresh,
  });
  const getCurrentWeek = () => {
    // const selected = weeks.filter((week) => {
    //   const now = moment();
    //   return (
    //     now.unix() >= moment(week.startDay).unix() &&
    //     now.unix() < moment(week.endDay).unix() + 24 * 60 * 60
    //   );
    // })[0];
    const index = weeks.findIndex((week) => {
      const now = moment();
      return (
        now.unix() >= moment(week.startDay).unix() &&
        now.unix() < moment(week.endDay).unix() + 24 * 60 * 60
      );
    });
    return index + 1;
  };

  return (
    <div>
      {semester ? (
        <div style={{ padding: '26px 16px', background: '#F2F4FB', borderRadius: 6 }}>
          <Row align='middle'>
            <Col span={3}>
              <Row>
                <div
                  style={{
                    background: '#5781F2',
                    display: 'inline-block',
                    padding: '10px 10px 10px 20px',
                    color: '#fff',
                    borderRadius: 2,
                  }}>
                  当前学期
                </div>
                <div className='triangle-right'></div>
              </Row>
            </Col>

            <Col span={7} style={styles.border}>
              <div style={{ paddingLeft: '10%' }}>
                <Row align='middle'>
                  <div style={styles.circle}></div>
                  <div>
                    {semester?.startYear}-{semester?.endYear}年
                    {semester?.orderNo && constant.semester.orderNo.get(semester?.orderNo)}
                  </div>
                </Row>
                <div style={styles.label}>学年学期</div>
              </div>
            </Col>

            <Col span={7} style={styles.border}>
              <div style={{ paddingLeft: '10%' }}>
                <Row align='middle'>
                  <div
                    style={{
                      ...styles.circle,
                      background: '#FCB21D',
                    }}></div>
                  <div style={styles.value}>
                    {moment(semester?.startDate).format('YYYY年MM月DD日')}-
                    {moment(semester?.endDate).format('YYYY年MM月DD日')}{' '}
                  </div>
                </Row>

                <div style={styles.label}>起止时间</div>
              </div>
            </Col>

            <Col span={7} style={styles.border}>
              <div style={{ paddingLeft: '10%' }}>
                <Row align='middle'>
                  <div
                    style={{
                      ...styles.circle,
                      background: '#3CC251',
                    }}></div>
                  <div style={styles.value}>
                    共{weeks.length}周，当前{getCurrentWeek()}周
                  </div>
                </Row>

                <div style={styles.label}>周历</div>
              </div>
            </Col>
          </Row>
        </div>
      ) : null}
    </div>
  );
}
