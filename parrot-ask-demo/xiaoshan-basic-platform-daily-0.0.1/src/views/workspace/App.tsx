/*
 * @Author: xuhansong
 * @Date: 2020-08-27 15:45:03
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-10-13 17:10:52
 * 智慧应用页面
 */
import React, { useEffect, useState } from 'react';
import { PlusCircleFilled, MinusCircleFilled } from '@ant-design/icons';
import api from 'src/api';
import { useRequest } from 'ahooks';
import * as style from './style';
import GT from 'types';
import { Button, message, Radio, Row, Spin } from 'antd';
import AppGroup from './components/app/Group';
import { RouteComponentProps } from 'react-router-dom';
import useUrlState from '@ahooksjs/use-url-state';
import useApp from 'src/hook/useApp';
import useSocket from 'src/hook/useSocket';
import { token } from 'src/utils';
import { useGlobalState } from 'src/store';

export default function ManageAppPage(props: RouteComponentProps) {
  const [state, setState] = useUrlState({ tab: '' });
  const { listen } = useSocket();
  const { getSubMenus } = useApp();
  useEffect(() => {
    return listen({ handler: (e) => {} });
  }, []);
  const [commons, setCommons] = useState<GT.Model.Menu[]>([]);
  const [edit, setEdit] = useState(false);
  const getApps = () => api.user.getPermissions({ style: 1, size: 2 });
  const { data, loading, refresh } = useRequest(() => getApps(), {
    onSuccess(res) {
      setState({
        tab: state.tab || res?.[0]?.id.toString(),
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
  const [state2, dispatch] = useGlobalState();
  const onClick = (data: GT.Model.Menu, index: number) => {
    if ([29, 30, 435].includes(data.id)) {
      window.open(`${data.path}&token=${token.get()}&refreshToken=${token.getRefresh()}&account=${state2.user?.name || ''}`);
      return;
    }
    if (data.path) {
      return props.history.push(`/app/${data.id}`);
    }
    const menus = getSubMenus(data.id);
    if (menus.length) {
      props.history.push(`/app/${data.id}/${menus?.[0]?.id}`);
    } else {
      // props.history.push(`/app/${data.id}`);
      message.info('该功能暂未开通，敬请期待');
    }
  };
  const index = data?.findIndex((item) => item.id.toString() === state.tab) || 0;
  const types = data?.[index]?.permissions || [];
  const typeCommon = commons?.[index] || [{ id: -1, zhName: '常用应用', permissions: [] }];
  const extra = (
    <Button type='link' onClick={() => setEdit(!edit)}>
      {edit ? '完成' : '设置'}
    </Button>
  );
  const typeCommonMap = typeCommon.permissions?.reduce((map, common) => {
    map.set(common.name, true);
    return map;
  }, new Map<string, boolean>());
  const count = (editable: boolean, index: number, item: GT.Model.Menu) => {
    // 首行显示移除按钮
    if (editable && !index) {
      return (
        <MinusCircleFilled
          style={{ color: '#FE4F54' }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            api.permission.deleteCommon(item.id).then(() => {
              message.success('移除成功');
              refresh();
            });
          }}
        />
      );
    }

    // 其他行显示添加按钮
    // console.log(commonMap, commons, 1);
    // console.log(commonMap.has(item.name), 111);
    if (editable && index && !typeCommonMap?.has(item.name)) {
      return (
        <PlusCircleFilled
          style={{ color: '#3CC251' }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            api.permission
              .createCommon({
                sort: 1,
                permissionId: item.id,
                rootId: state.tab,
              })
              .then(() => {
                message.success('设置成功');
                refresh();
              });
          }}
        />
      );
    }
  };
  return (
    <div style={style.container}>
      <div style={{ padding: 20, background: '#fff' }}>
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
        <Spin spinning={loading}>
          {[typeCommon, ...types].map((type, index) => (
            <div style={{ borderBottom: !index ? '1px solid #DFE1E6' : 'none' }}>
              <AppGroup
                extra={!index ? extra : null}
                title={type.zhName}
                data={type.permissions || []}
                count={(menu: GT.Model.Menu) => count(edit, index, menu)}
                onClick={onClick}></AppGroup>
            </div>
          ))}
        </Spin>
      </div>
    </div>
  );
}
