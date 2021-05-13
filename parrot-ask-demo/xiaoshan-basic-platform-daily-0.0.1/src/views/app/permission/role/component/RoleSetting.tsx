import React, { useRef, useState } from 'react';
import GT from 'types';
import { Spin, Space, Button, message } from 'antd';
import api from 'src/api';
import PermissionTab from 'src/components/PermissionTab';
import { useRequest, useBoolean } from 'ahooks';
import RoleDataScopeTab from './DataScopeTab';
export default function RoleSetting(props: { roleId: number; editable: boolean }) {
  const { data = [], loading, refresh } = useRequest(
    () =>
      Promise.all([
        api.role.getDataScopes(props.roleId),
        api.role.getPermissions(props.roleId),
        api.role.get(props.roleId),
      ]),
    {
      refreshDeps: [props.roleId],
    },
  );
  const [key, setKey] = useState(Date.now());
  const scopeModal = useRef<any>();
  const [dataScopes, permissions, role] = data;
  const [map, setMap] = useState<
    Map<number, { checkedKeys: string[]; halfCheckedKeys: string[] }>
  >();
  const [edit, { setTrue, setFalse }] = useBoolean(false);
  const onCheck = (map: Map<number, { checkedKeys: string[]; halfCheckedKeys: string[] }>) => {
    setMap(map);
  };
  const onSubmit = () => {
    if (role?.defaultState === 0) {
      scopeModal.current?.getFormData().then((res: GT.Model.RoleDataScope[]) => {
        let q = [api.role.updateDataScopes(props.roleId, res)];
        if (map) {
          const ids = [...map.entries()].reduce((arr, [value, item], index) => {
            arr = [...arr, value, ...item.checkedKeys, ...item.halfCheckedKeys];
            return arr;
          }, [] as any[]);
          q.push(
            api.role.updatePermissions(props.roleId, {
              ids,
            }),
          );
        }
        Promise.all(q).then(() => {
          message.success('保存成功');
          setFalse();
        });
      });
    } else {
      if (map) {
        const ids = [...map.entries()].reduce((arr, [value, item], index) => {
          arr = [...arr, value, ...item.checkedKeys, ...item.halfCheckedKeys];
          return arr;
        }, [] as any[]);
        api.role
          .updatePermissions(props.roleId, {
            ids,
          })
          .then(() => {
            message.success('保存成功');
            setFalse();
          });
      }
    }
  };
  return (
    <div>
      <Spin spinning={loading}>
        {!loading && role?.defaultState === 0 && (
          <div>
            <p style={{ fontSize: 16 }}>数据权限</p>
            <RoleDataScopeTab
              key={key}
              id={props.roleId}
              onRef={(ref) => (scopeModal.current = ref)}
              defaultValue={dataScopes}
              disabled={!edit}></RoleDataScopeTab>
          </div>
        )}
        {!loading && permissions && (
          <div>
            <p style={{ fontSize: 16 }}>功能权限</p>
            <PermissionTab
              key={key}
              defaultCheckedKeys={permissions.map((item) => item.toString())}
              onCheck={onCheck}
              disabled={!edit}></PermissionTab>
            <Space>
              {!edit && props.editable && (
                <Button type='primary' onClick={() => setTrue()}>
                  编辑
                </Button>
              )}
              {edit && (
                <Button
                  onClick={() => {
                    setFalse();
                    setKey(Date.now());
                  }}>
                  取消
                </Button>
              )}
              {edit && (
                <Button type='primary' onClick={onSubmit}>
                  保存
                </Button>
              )}
            </Space>
          </div>
        )}
      </Spin>
    </div>
  );
}

RoleSetting.defaultProps = {
  editable: true,
};
