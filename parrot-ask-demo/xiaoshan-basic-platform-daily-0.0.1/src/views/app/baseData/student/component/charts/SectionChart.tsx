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
import { Empty, Row } from 'antd';

interface ChartProps {
  title: string;
  dataSource?: any[];
}

export default function BuildingChart(props: ChartProps) {
  const map = new Map();
  props.dataSource?.forEach((data) => {
    map.set(data.label, data.value);
  });
  return (
    <div>
      <div style={{ padding: 10 }}>{props.title}</div>
      {props.dataSource?.every((item) => !item.value) ? (
        <Row style={{ height: 200 }} align='middle' justify='center'>
          <Empty></Empty>
        </Row>
      ) : (
        <Chart data={props.dataSource} height={200} autoFit>
          <Coordinate type='theta' radius={0.5} innerRadius={0.5} />
          <Legend
            position='right'
            offsetX={-40}
            maxItemWidth={200}
            itemName={{
              formatter: (text, item, index) => {
                const sum = [...map.values()].reduce((sum, item) => sum + item, 0);
                const rate = sum ? (map.get(text) / sum) * 100 : 0;
                return `${text} : ${rate.toFixed(2)}%`;
              },
            }}></Legend>
          <Axis visible={false} />
          <Tooltip showTitle={false} />
          <Interval
            adjust='stack'
            position='value'
            color={['label', ['#3E7EF5', '#23B899', '#8978FF']]}
            shape='sliceShape'
          />
          <Interaction type='element-single-selected' />
        </Chart>
      )}
    </div>
  );
}
