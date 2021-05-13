import { Badge, Layout, Radio, Row } from "antd";
import React, { ReactNode, useMemo, useState, useEffect } from "react";
import useUrlState from '@ahooksjs/use-url-state';
import MessageList from './component/MessageList';
import TaskList from './component/TaskList';
import api from "src/api";
import useSocket from "src/hook/useSocket";
const { Content } = Layout;

export default function MessageCenter() {
  const [unReadCount, setUnReadCount] = useState(0);
  const [todoCount, setTodoCount] = useState(0);
  const getUnreadCount = ()=> {
    api.message.unreadCount().then((value) => {
      setUnReadCount(value);
    });
  };
  const getToDoCount = () => {
    api.task.toDoCount().then((value) => {
      setTodoCount(value);
    });
  };
  useEffect(() => {
    getUnreadCount();
    getToDoCount();
  }, []);
  const { listen } = useSocket();
  useEffect(()=> {
    return listen({type: 3, handler: () => {
      getUnreadCount();
      getToDoCount();
    }});
  }, []);
  return (
    <MessagePageTab unReadCount={unReadCount} todoCount={todoCount}>
      {({tab}) => (
        <div>
          {tab == "1" && <MessageList unreadCount={unReadCount}></MessageList>}
          {tab == "2" && <TaskList countChange={getToDoCount}></TaskList>}
        </div>
      )}
    </MessagePageTab>
  );
}

function MessagePageTab(props: {
  children: (options: { tab: string },) => ReactNode; unReadCount: number; todoCount: number;
}) {
  const tabs = [{id: 1, name: "消息中心", count: props.unReadCount}, {id: 2, name: "待办事项", count: props.todoCount}];
  const [state, setState] = useUrlState({ tab: tabs?.[0]?.id.toString() });
  const content = useMemo(() => props.children({ tab: state.tab }), [
    state,
  ]);
  return (
    <Layout style={{ overflowX: 'hidden', background: '#fff', height: '100%', padding: 20 }}>
      <p>
        <Row justify='center'>
          <Radio.Group
            value={state.tab}
            className='page_tab'
            buttonStyle='solid'
            onChange={(e) => setState({ tab: e.target.value })}>
            {tabs.map((tab) => (
            <Badge count={tab.count} size='small' style={{fontSize: 10, maxWidth: 30, padding: 0, paddingLeft: 4, paddingRight: 4, zIndex: 1000, boxShadow: 'none'}}> 
              <Radio.Button value={tab.id.toString()} style={{borderRadius: tab.id === 1 ? "3px 0 0 3px": "0 3px 3px 0", borderWidth: 0}}>{tab.name}</Radio.Button>
            </Badge>
            ))}
          </Radio.Group>
        </Row>
      </p>
      <Content>{content}</Content>
    </Layout>
  );
}