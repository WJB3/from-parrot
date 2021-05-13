import React, { useState, useEffect } from 'react';
import { Card, Radio, Row, Col, Avatar, message, Empty, Space, Button } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import GT from 'types';
import { useRequest } from 'ahooks';
import api from 'src/api';

import useUrlState from '@ahooksjs/use-url-state';
import AppItem from 'src/components/AppItem';
import useApp from 'src/hook/useApp';
import { useHistory } from 'react-router-dom';
import { useGlobalState } from 'src/store';
import { token } from 'src/utils';

export default function CommonApp() {
  const [state, setState] = useUrlState({ tab: '' });
  const [collapsed, setCollapsed] = useState(true);
  const [active, setActive] = useState(0);
  const { getSubMenus } = useApp();
  const history = useHistory();
  const [commons, setCommons] = useState<GT.Model.Menu[]>([]);
  const getApps = () => api.user.getPermissions({ style: 1, size: 2 });
  const { data, loading, refresh } = useRequest(() => getApps(), {
    onSuccess(res) {
      setState({
        tab: res?.[0]?.id.toString(),
      });
      Promise.all(res.map((p) => api.permission.getCommons({ rootId: p.id }))).then((commons) => {
        setCommons(
          commons.map(
            (item) =>
              ({
                id: -1,
                name: '2',
                zhName: '常用应用',
                permissions: item,
              } as GT.Model.Menu),
          ),
        );
      });
    },
  });
  useEffect(() => {
    if (!state.tab) {
      setState({ tab: data?.[0]?.id.toString() });
    }
  }, [state.tab]);
  const onChange = (e: any) => {
    setActive(e?.target?.value);
  };
  const [state2, dispatch] = useGlobalState();
  const index = data?.findIndex((item) => item.id.toString() === state.tab) || 0;
  const typeCommon = commons?.[index] || [{ id: -1, zhName: '常用应用', permissions: [] }];
  const onClick = (data: GT.Model.Menu) => {
    if ([29, 30, 435].includes(data.id)) {
      window.open(`${data.path}&token=${token.get()}&refreshToken=${token.getRefresh()}&account=${state2.user?.name || ''}`);
      return;
    }
    if (data.path) {
      return history.push(`/app/${data.id}`);
    }
    const menus = getSubMenus(data.id);
    if (menus.length) {
      history.push(`/app/${data.id}/${menus?.[0]?.id}`);
    } else {
      message.info('该功能暂未开通，敬请期待');
    }
  };
  return (
    <Card
      style={{ width: '100%' }}
      title='常用应用'
      headStyle={{ border: 'none' }}
      extra={<a href={`#/app?tab=${state.tab}`}>全部</a>}>
      <p>
        <Row justify='center'>
          <Radio.Group
            buttonStyle='solid'
            value={state.tab}
            onChange={(e) =>
              setState({
                tab: e.target.value,
              })
            }>
            {data?.map((d) => (
              <Radio.Button value={d.id.toString()}>{d.zhName}</Radio.Button>
            ))}
          </Radio.Group>
        </Row>
      </p>
      {!typeCommon.permissions?.length ? (
        <div>
          <Empty
            image='https://api.xshs.cn:8688/frontend/empty.png'
            description={
              <Space size='small'>
                您未设置常用应用
                <Button size='small' type='link' href={`#/app?tab=${state.tab}`}>
                  去设置
                </Button>
              </Space>
            }></Empty>
        </div>
      ) : (
        <Row
          gutter={[60, 30]}
          style={{
            overflow: 'hidden',
            flexWrap: collapsed ? 'nowrap' : 'wrap',
            height: collapsed ? 126 : 'auto',
            transition: 'all  cubic-bezier(.645,.045,.355,1) .5s',
          }}>
          {typeCommon.permissions?.map((data) => {
            return (
              <Col onClick={() => onClick(data)}>
                <AppItem src={data.iconUrl || data.zhName} name={data.zhName} />
              </Col>
            );
          })}
        </Row>
      )}

      {(typeCommon.permissions?.length && typeCommon.permissions?.length > 10 && (
        <Row justify='center'>
          <DoubleRightOutlined
            onClick={() => setCollapsed(!collapsed)}
            style={{
              transform: `rotate(90deg) ${collapsed ? '' : 'rotateY(180deg)'}`,
              transition: 'all cubic-bezier(.645,.045,.355,1) .3s',
            }}
          />
        </Row>
      )) ||
        null}
    </Card>
  );
}
