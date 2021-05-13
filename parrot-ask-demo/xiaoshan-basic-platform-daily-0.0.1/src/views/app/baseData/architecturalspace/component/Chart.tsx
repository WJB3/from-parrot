import React from 'react';
import {
  Chart,
  Axis,
  Coordinate,
  DonutChart,
  Interval,
  Legend,
  Tooltip,
  Interaction,
} from 'bizcharts';
import { Empty, Row, Space } from 'antd';

interface ChartProps {
  title: string;
  dataSource?: any[];
}

export default function BuildingChart(props: ChartProps) {
  const map = new Map();
  props.dataSource?.forEach((data) => {
    map.set(data.type, data.percentage * 100);
  });
  return (
    <div>
      <div style={{ padding: 10 }}>{props.title}</div>
      {props.dataSource?.every((item) => !item.percentage) ? (
        <Row style={{ height: 200 }} align='middle' justify='center'>
          <Empty></Empty>
        </Row>
      ) : (
        <Chart
          data={props.dataSource?.map((item) => ({
            ...item,
            percentage: item.percentage * 100,
          }))}
          height={200}
          autoFit
          title={props.title}
          padding='auto'>
          <Coordinate type='theta' radius={0.6} innerRadius={0.59} />
          <Legend
            position='right'
            offsetX={-80}
            maxWidth={150}
            maxItemWidth={200}
            itemName={{
              style: {
                wordBreak: 'all',
              },
              formatter: (text, item, index) => {
                // const sum = [...map.values()].reduce((sum, item) => sum + item, 0);
                // const rate = sum ? (map.get(text) / sum) * 100 : 0;
                return `${text} : ${map.get(text)?.toFixed(2) || '0.00'}%`;
              },
            }}></Legend>
          <Axis visible={false} />
          <Tooltip showTitle={false} visible>
            {(title, items) => {
              return (
                <Space style={{ padding: 10 }}>
                  <div
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 8,
                      background: items?.[0].color,
                    }}></div>
                  <div>
                    {title}：{Number(items?.[0].data.num || 0)}
                  </div>
                </Space>
              );
            }}
          </Tooltip>
          <Interval
            adjust='stack'
            position='percentage'
            color={['type', ['#3E7EF5', '#6DD230', '#8978FF', '#23B899', '#FE7C4B']]}
            shape='sliceShape'
          />
          <Interaction type='element-single-selected' />
        </Chart>
      )}
    </div>
  );
}
