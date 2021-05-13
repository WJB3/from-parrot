import React, { useRef, useState, useEffect } from 'react';
import { Row, Space, DatePicker, Radio, Col } from 'antd';

import api from 'src/api';
import GT from 'types';
import ChartGroup from './component/ChartGroup';
import { useGlobalState } from 'src/store';
import ChartHeadItem, { Refs } from './component/ChartHeadItem'
import moment from 'moment';

export default function SummaryPage() {
  const [state] = useGlobalState();

  const [parmas, setParmas] = useState<GT.DTO.SearchLeaveSummaryParmas>({timeRange: 1});
  const [leaveCount, setLeaveCount] = useState<GT.Model.LeaveCount[]>();
  const itemRef = useRef<any[]>([])

  const refresh = ()=> {
    // 重置下面的搜索数据
    itemRef.current.forEach((item) => item.setClearCondition(null))
    api.leave.summary(parmas)
    .then((result)=> {
      setLeaveCount(result);
    });
  };
  useEffect(() => {
    console.log(parmas);
    refresh();
  }, [parmas]);

  // 通过classId 获取数据并替换
  const getClassData = (classId?: number) => {
    if (classId === undefined) {
      refresh();
      return;
    }
    const filter = {
      ...parmas,
      classId: classId
    };
    api.leave.summary(filter).then((result) => {
      // 获取数据并替换setLeaveCount 这个是校领导的替换思路
      // console.log(result);
      // if (state.user?.roles.includes("school_leader")) {
      //   // 校领导
        replaceSearchData(result, classId);
      // } else if (state.user?.roles.includes("grade_group_members")) {
      //   // 年级主任
      //   changeOrgData(result);
      // }
    });
  }

  // 校领导替换数据
  const replaceSearchData = (result: GT.Model.LeaveCount[], classId: number) => {
    let currentIndex: number| undefined;
    if (leaveCount) {
      for (let index = 0; index < leaveCount.length; index++) {
        const element = leaveCount[index];
        // 找到对应年级是否由此班级 有就替换
        const findClass = element.classes.length > 0&&element.classes.find(model => model.id === classId);
        if (findClass) {
          currentIndex = index;
          break;
        }
      }

      if (currentIndex !== undefined) {
        let changeModel = leaveCount;
        // 判断result 是否是空数组 replace替换 counts中的数据
        changeModel[currentIndex].counts = result&&result[0].counts;
        // 解构数组 不指向相同的地址
        setLeaveCount([...changeModel]);
      }
    }
    currentIndex = undefined;
  }

  // 年级主任替换数据
  const changeOrgData = (result: GT.Model.LeaveCount[]) => {
    // 直接替换原始数据
    if (result&&result.length > 0) {
      setLeaveCount([...result]);
    }
  }

  const tabs = new Map([[0, '昨天'], [1, '今天'], [2, '明天'], [3, '本周'], [4, '本月']]);
  const headColors = ['#23B899', '#4C84FF', '#7877D4', '#B864E8', '#596F9B', '#23B87C'];
  const timeChange = (values: any, formatStrings: string[]) => {
    if (values) {
      if (formatStrings.length == 2) {
        const startTime = formatStrings[0];
        const endTime = formatStrings[1];
        setParmas({startTime: `${startTime} 00:00`, endTime: `${endTime} 23:59`})
      }
    } else {
      setParmas({timeRange: 1});
    }
  };

  // 渲染班级title
  const renderClassTitle = (className: string) => {
    // 渲染班级的名称
    return (
      <div style={{display: 'flex', position: 'relative'}} >
        <span style={{width: '4px', height: '12px', backgroundColor: '#5781F2', borderRadius: 6, paddingLeft: '4px', marginTop: '6px'}}></span>
        <span style={{color: '#303133', fontSize: '16px', fontWeight: 'bold', marginLeft: '5px'}}>{className + '班'}</span>
      </div>
    )
  };

  // 渲染页面
  const render = () => {
    if (state.user?.roles.includes("school_leader") || state.user?.roles.includes("ROLE_admin") || state.user?.roles.includes("ROLE_system_admin")) {
      // 校领导
      return (
        <div>
          <Row gutter={12} style={{height: '120px'}}>
            {leaveCount!.map((leave, index) => {
            return (
            <Col span={4}>
                <div style={{textAlign: 'center', borderRadius: 6, height: 90, backgroundColor: headColors[index]}}>
                  <p style={{marginTop: 20, fontSize: 26, fontWeight: 'bold', color: 'white', paddingTop: '10px', marginBottom: '0px'}}>{leave.gradeLeaveCount}</p>
                  <p style={{fontSize: 13, color: 'white'}}>{leave.gradeName}</p>
                </div>
              </Col>
            )
            })}
          </Row>
          <br/>
          {leaveCount!.map((leave, index) => {
            return leave.counts.map((item) => {
              return (
                <div>
                  <ChartHeadItem 
                    title={leave.gradeName} 
                    items={leave.classes} 
                    onRef={(ref)=> itemRef.current[index] = ref}
                    onSelect={(classId) => {
                      // 选中的回调
                      getClassData(classId)
                    }} />
                  <ChartGroup item={item} />
                </div>
              )
            })
          })}
        </div>
      );
    } else if (state.user?.roles.includes("ROLE_grade_group_members")) {
      // 年级组成员
      return leaveCount!.map((leave, index) => {
        return (        
          <div>
            <ChartHeadItem title={leave.gradeName} 
            items={leave.classes} 
            onRef={(ref)=> itemRef.current[index] = ref}
            onSelect={(classId) => {
              // 选中的回调
              for (let item of leave.counts) {
                if (classId) {
                  item.isHidden = true;
                  if (classId === item.classId) {
                    item.isHidden = false;
                  }
                } else {
                  item.isHidden = false;
                }
              }
              setLeaveCount([...leaveCount!]);
              // getClassData(classId)
            }}/>
            {leave.counts.map((item) => {
              if (item.isHidden) {
                return null;
              }
              return (
                <div>
                  {renderClassTitle(item.className)}
                  <ChartGroup item={item} />
                </div>
              )
            })}
          </div>);
      });
    } else {
      // 班主任
      return (
        <div>
          {leaveCount!.map((leave, index) => {
            return leave.counts.map((item) => {
              return (
                <div>
                  <ChartHeadItem title={leave.gradeName} 
                  onRef={(ref)=> itemRef.current[index] = ref}
                  />
                  {renderClassTitle(item.className)}
                  <ChartGroup item={item} />
                </div>
              )
            })
          })}
        </div>
      );
    }
  };

  return (
    <div>
      <Row>
        <Space>
          <Radio.Group
            className='page_tab'
            buttonStyle='solid'
            value={parmas.timeRange}
            onChange={(e) => setParmas({timeRange: e.target.value})}>
              {[...tabs.entries()].map( ([id, name]) => {
                return <Radio.Button style={{borderWidth: 0}} value={id}>{name}</Radio.Button>
              })}
          </Radio.Group>

          <DatePicker.RangePicker style={{ width: 300 }} format="yyyy-MM-DD" placeholder={['开始时间', '结束时间']} onChange={timeChange} value={parmas.startTime == undefined ? undefined : [moment(parmas.startTime!, "YYYY-MM-DD HH:mm"), moment(parmas.endTime!, "YYYY-MM-DD HH:mm")]} />
        </Space>
      </Row>
      <br/>
      {leaveCount && render()}
    </div>
  );
}