import React, { useEffect, useState } from 'react';
import { Row, Col, Spin } from "antd";
import GT from 'types';
import api from 'src/api';
import { useRequest } from 'ahooks';
import { ActionType, useGlobalState } from 'src/store';

export default function ResultDetail(props: {recordId: number}) {
  const [loadingFlag, setLoadingFlag] = useState<boolean>(true);

  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: "考评详情" }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);
  
  const [details, setDetails] = useState<GT.Model.MentTaskResult>();

  // 获取详情数据
  const { data: formData } = useRequest(() => api.assessment.getMyDetail(props.recordId), {
    refreshDeps: [props.recordId],
    onSuccess(result) {
      setDetails(result);
      setLoadingFlag(false);
    },
    onError: (e) => {
      setLoadingFlag(false);
    },
  });

  const renderTable = () => {
    if (details == undefined || details?.items == undefined) {
        return null;
    }
    const numberZh = new Map([[0, "一、"], [1, "二、"], [2, "三、"], [3, "四、"], [4, "五、"], [5, "六、"], [6, "七、"], [7, "八、"]]);
    return details?.items.map((model, index) => {
      // 当只有一个对象时无需分组
      // let list = [model.subItems]
      // 有多个对象时，对数组分组成多个
      // if (model.subItemActualScores != undefined) {
        const groupBy = (array: GT.Model.MentTaskResultSubItem[], f: Function) => {
          const groups: {[key: string]: GT.Model.MentTaskResultSubItem[]} = {};
          array.forEach((item) => {
            const group = f(item);
            groups[group] = groups[group] || [];
            groups[group].push(item);
          });
          return Object.keys(groups).map((group) => {
            return groups[group];
          });
        };
        const list = groupBy(model.subItems, (item: GT.Model.MentTaskResultSubItem) => {
          return item.semesterOrder;
        });
      // }
      return (
        <div>
          <Row style={{backgroundColor: 'rgba(228, 231, 240, 0.5)', height: 38, justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #DFE1E6'}}>
            <Col style={{color: '#303133', fontSize: 16, fontWeight: 'bold', paddingLeft: 17}}>
              {numberZh.get(index) + model.name}
            </Col>
            <Col flex="71px" style={{color: '#303133', fontSize: 18, fontWeight: 'bold', borderLeft: '1px solid #DFE1E6', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {model.totalActualScore}
            </Col>
          </Row>
          {renderContent(list, index)}
        </div>
      );
    })
  };

  const renderContent = (list: GT.Model.MentTaskResultSubItem[][], index: number) => {
    if (list.length == 1) {
      return renderOne(list[0], index);
    } else if (list.length == 2) {
      return renderTwo(list, index);
    } else if (list.length == 3) {
      return renderThree(list, index);
    } else {
      return null;
    }
  };

  const renderThree = (list: GT.Model.MentTaskResultSubItem[][], index: number) => {
    return (
      <div>
        {renderTwo(list.slice(0, 2), index)}
        {renderOne(list[2], index)}
      </div>
    );
  };

  const renderTwo = (list: GT.Model.MentTaskResultSubItem[][], index: number) => {
    return <Row style={{alignItems: 'center',  borderBottom: (index == details!.items.length - 1 ? undefined : '1px solid #DFE1E6')}}>
      {list.map((item, i) => {
        return (
        <Col span={i == 0 ? 13 : 11}>
          <Row>
            <Col flex="186px" style={{color: '#616266', fontSize: 14, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: (i == 0 ? undefined : '1px solid #DFE1E6')}}>
              {i == 0 ? "第一学期" : "第二学期"}
            </Col>
            <Col flex="auto">
            {item.map((e, j) => {
              return (
              <Row style={{justifyContent: 'space-between', alignItems: 'center', height: 36, borderBottom: (j === (item.length - 1) ? undefined : '1px solid #DFE1E6')}}>
                <Col {...(i === (list.length - 1) ? {flex: "auto"}: {span: 12})} style={{textAlign: 'center', borderLeft: '1px solid #DFE1E6', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 186}}>
                  {e.name}
                </Col>
                <Col {...(i === (list.length - 1) ? {flex: "70px"}: {span: 12})} style={{textAlign: 'center', borderLeft: '1px solid #DFE1E6', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {e.actualScore ? (e.plusMinus ? e.actualScore : `-${e.actualScore}`) : ""}
                </Col>
              </Row>)
            })}
            </Col>
          </Row>
        </Col>)
    })}
    </Row>
  };

  const renderOne = (subItems: GT.Model.MentTaskResultSubItem[], index: number) => {
    return (
      <Row style={{alignItems: 'center', borderBottom: (index == details!.items.length - 1 ? undefined : '1px solid #DFE1E6')}}>
        <Col flex="186px" style={{color: '#616266', fontSize: 14, textAlign: 'center'}}>
        全年
        </Col>
        <Col flex="auto" style={{color: '#303133', fontSize: 14}}>
          {subItems.map((e, j) => {
            return (
            <Row style={{justifyContent: 'space-between', alignItems: 'center', height: 36, borderBottom: (j == subItems.length - 1 ? undefined: '1px solid #DFE1E6')}}>
              <Col flex="auto" style={{borderLeft: '1px solid #DFE1E6'}}>
                <p style={{paddingLeft: 20, marginBottom: 0, height: 36, display: 'flex', alignItems: 'center'}}>
                  {e.name}
                </p>
              </Col>
              <Col flex="71px" style={{textAlign: 'center', borderLeft: '1px solid #DFE1E6', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {e.actualScore ? (e.plusMinus ? e.actualScore : `-${e.actualScore}`) : ""}
              </Col>
            </Row>)
          })}
        </Col>
      </Row>
    );
  };

  return loadingFlag ? (
    <Row justify="center">
      <Spin
        style={{ marginTop: "30vh" }}
        spinning={loadingFlag}
        size="large"
      ></Spin>
    </Row>
  ) : (
    <div className="form_list">
      <div style={{width: 1000}}>
        <p style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 0, lineHeight: '33px' }}>
            {details?.taskName}
        </p>
        <p style={{ fontSize: 14, color: '#909499', textAlign: 'center', marginBottom: 0, lineHeight: '20px', marginTop: 8}}>
          {details?.publishedCount == 1 ? details?.publishedTime + "  发布" :  details?.publishedTime + "  更新发布"}
        </p>
        <p>
          <Row justify='space-between' style={{alignItems: 'center'}}>
            <div style={{display: 'flex' }}>
              <p style={{fontSize: 14, marginBottom: 0}}>教师姓名：{details?.name}</p>
              <p style={{fontSize: 14, marginBottom: 0, marginLeft: 20}}>手机号：{details?.phone}</p>
            </div>
            <p style={{fontSize: 14, marginBottom: 0}}>考核分数：<span style={{fontSize: 24, fontWeight: 'bold', color: '#FF8948'}}>{details?.resultScore}</span></p>
          </Row>
          <Row justify='space-between' style={{height: 40, backgroundColor: '#5781F2', alignItems: 'center'}}>
            <div style={{fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', paddingLeft: 17}}>{details?.name}-考核分数</div>
            <div style={{fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', width: 71, textAlign: 'center'}}>{details?.resultScore}</div>
          </Row>
          <div style={{border: '1px solid #DFE1E6'}}>
            {renderTable()}
          </div>
        </p>
      </div>
    </div>
  )
}
