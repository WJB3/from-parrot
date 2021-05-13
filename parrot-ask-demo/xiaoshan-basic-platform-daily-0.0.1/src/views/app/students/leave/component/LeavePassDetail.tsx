import React, { useState, useEffect } from 'react';
import LeaveDetail from './LeaveDetail';
import LeaveDetailList from './LeaveDetailList';
import { Radio, Layout } from 'antd';
import useUrlState from '@ahooksjs/use-url-state';
import { useGlobalState, ActionType } from "src/store";

const { Content } = Layout;

export default function LeaveTabPage(props: {recordId: number, tabId?: number}) {
  const titleLists = [{id: 0, value: '请假详情'}, {id: 1, value: '请假学生名单'}];
  const [state, setState] = useUrlState({ pageTab: props.tabId ? Number(props.tabId) : 0 });
  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: "查看请假记录" }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);

  const detailContentStyle = () => {
    if (Number(state.pageTab) === 0) {
      return {display: "block"};
    } else {
      return {display: "none"};
    }
  };

  const listContentStyle = () => {
    if (Number(state.pageTab) === 1) {
      return {display: "block"};
    } else {
      return {display: "none"};
    }
  };

  const content = () => {
    return (
    <div>
      <div style={detailContentStyle()}>
        <LeaveDetail recordId={props.recordId} onRef={(ref) => console.log(ref)}></LeaveDetail>
      </div>
      <div style={listContentStyle()}>
        <LeaveDetailList recordId={props.recordId}></LeaveDetailList>
      </div>
    </div>
    )
  }

  return (
    <Layout style={{ overflowX: 'hidden', background: '#fff', height: '100%' }}>
    <p>
      <Radio.Group
        value={Number(state.pageTab)}
        className='page_tab'
        buttonStyle='solid'
        onChange={(e) => setState({pageTab:e.target.value})}>
        {titleLists.map((model) => (
          <Radio.Button value={model.id}>{model.value}</Radio.Button>
        ))}
      </Radio.Group>
    </p>
      <Content>{content()}</Content>
  </Layout>
  );
}

