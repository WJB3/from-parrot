import React, {useState} from 'react'
import {Row, Col, Select} from 'antd'
import GT from 'types';

export interface Refs {
  [key: string]: any;
}

// 每个chartGroup的头部搜索组件
export default function ChartHeadItem(props: {title: string, items?: GT.Model.summayClassInfo[], onSelect?: (data?: any) => void, onRef: (item: Refs) => void}) {
  const classes = props.items;
  const [clearCondition, setClearCondition] = useState<number>();

  // 选择班级的回调
  const onChangeClass = (classId?: any) => {
    console.log('选择数据', classId);
    setClearCondition(classId);
    props.onSelect&&props.onSelect(classId);
  }

  props.onRef({
    setClearCondition,
  });

  return (
    <div>
      <Row style={{marginBottom: '10px'}}>
        <Col flex='400px'>
          <div style={{color: '#303133', fontSize: '18px', fontWeight: 'bold'}}>{props.title}请假统计</div>
        </Col>
        {classes ? (
          <Col flex='auto' style={{display: 'flex', justifyContent: 'flex-end'}}>
            <span style={{paddingLeft: '45px', paddingTop: '5px'}}>班级筛选</span>
            <Select style={{width: 160, marginLeft: '20px'}}
              placeholder="所有班级"
              allowClear
              virtual={false}
              value={clearCondition}
              onChange={(val, text) => onChangeClass(val)}>
                {classes.map((model) => (
                  <Select.Option value={model.id}>{model.name}</Select.Option>
                ))}
            </Select>
          </Col>
        ) : null}
      </Row>
    </div>
  )
}
