import React, { ReactNode, useEffect, useMemo } from 'react';
import { Radio, Layout } from 'antd';
import useUrlState from '@ahooksjs/use-url-state';
import useApp from 'src/hook/useApp';
import { useRouteMatch } from 'react-router-dom';
import { ActionType, useGlobalState } from 'src/store';
const { Header, Content } = Layout;

export default function PageTab(props: {
  children: (options: { id: string; pageId: string; tab: string }) => ReactNode;
}) {
  const [,dispatch] = useGlobalState();
  const { getSubMenus, parseURL } = useApp();
  const match = useRouteMatch();
  const { id, pageId } = parseURL(match.path);
  const tabs = getSubMenus(Number(pageId));
  const [state, setState] = useUrlState({ tab: tabs?.[0]?.id.toString() });
  useEffect(() => {
   
      dispatch({
        type:ActionType.UpdateTabId,
        payload:tabs?.[0]?.id.toString()
      })
      return () => {
        dispatch({ type: ActionType.UpdateTabId, payload: undefined });
      };
  }, []);
  const content = useMemo(() => props.children({ id, pageId, tab: state.tab }), [
    id,
    pageId,
    state,
  ]);
  return (
    <Layout style={{ overflowX: 'hidden', background: '#fff', height: '100%' }}>
      <p>
        <Radio.Group
          value={state.tab}
          className='page_tab'
          buttonStyle='solid'
          onChange={(e) => setState({ tab: e.target.value })}>
          {tabs.map((tab) => (
            <Radio.Button value={tab.id.toString()}>{tab.zhName}</Radio.Button>
          ))}
        </Radio.Group>
      </p>
      <Content>{content}</Content>
    </Layout>
  );
}
