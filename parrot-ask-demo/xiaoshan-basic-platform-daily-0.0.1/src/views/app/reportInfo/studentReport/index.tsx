import React, { useState, useEffect } from 'react';
import ReportStudentDetail from './ReportStudentDetail';
import { RouteComponentProps } from 'react-router-dom';
import PrivateComponent from 'src/components/PrivateComponent';
import PageTab from 'src/components/PageTab';
import { Radio, Layout } from 'antd';
import { stringify } from 'querystring';
import ReportStudentList from './ReportStudentList'
import useUrlState from '@ahooksjs/use-url-state';
import { useGlobalState, ActionType } from "src/store";

const { Header, Content } = Layout;

export default function ReportTabPage(props: any) {
  const [chooseValue, setChooseValue] = useState(props.tabId ? Number(props.tabId) : 0);
  const titleLists = [{id: 0, value: '发起获奖登记'}, {id: 1, value: '查看填报数据'}];
  const [state, setState] = useUrlState({ pageTab: props.tabId ? Number(props.tabId) : 0 });
  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: props.taskName }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);

  const detailContentStyle = () => {
    // console.log(state.pageTab === 0);
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
    return <div>
              <div style={detailContentStyle()}>
                <ReportStudentDetail taskId={Number(props.taskId)} taskName={props.taskName} updateModal={state.pageTab === "0" ? true : false}></ReportStudentDetail>
              </div>
              <div style={listContentStyle()}>
                <ReportStudentList taskId={Number(props.taskId)} needRefresh={(Number(state.pageTab) === 1) ? true:  false}></ReportStudentList>
              </div>
           </div>
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

