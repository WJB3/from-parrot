import React, { useState, useRef } from 'react';
import GT from 'types';
import { Radio, Tree, Carousel } from 'antd';
import { useRequest } from 'ahooks';
import api from 'src/api';
interface PermissionTabProps {
  defaultCheckedKeys: string[];
  disabled?: boolean;
  onCheck?: (map: Map<number, { checkedKeys: string[]; halfCheckedKeys: string[] }>) => void;
}
export default function PermissionTab(props: PermissionTabProps) {
  const [tab, setTab] = useState(0);
  const carousel = useRef<Carousel>(null);
  const tree = useRef<any>([]);
  const [map, setMap] = useState<Map<number, { checkedKeys: string[]; halfCheckedKeys: string[] }>>(
    new Map(),
  );
  const { data, loading } = useRequest(() => api.permission.getPermissions({ style: 1 }), {
    onSuccess(menus) {
      setTab(menus[0].id);
      tree.current.forEach((item: any, index: number) => {
        onCheck(menus[index].id, item.state.checkedKeys, {
          halfCheckedKeys: item.state.halfCheckedKeys,
        });
      });
    },
  });
  const renderTreeNode = (menus: GT.Model.Menu[]) => {
    return menus.map((item) => (
      <Tree.TreeNode key={item.id} title={item.zhName} data={{ ...item, key: item.id }}>
        {item.permissions && renderTreeNode(item.permissions)}
      </Tree.TreeNode>
    ));
  };
  const onCheck = (parentId: number, checkedKeys: any, info: any) => {
    map.set(parentId, {
      checkedKeys,
      halfCheckedKeys: info.halfCheckedKeys,
    });
    props.onCheck?.(map);
  };
  return (
    <div>
      <p>
        <Radio.Group
          buttonStyle='solid'
          value={tab}
          onChange={(e) => {
            carousel.current?.goTo(
              data?.findIndex((item) => item.id === e.target.value) || 0,
              true,
            );
            setTab(e.target.value);
          }}>
          {data?.map((menu) => (
            <Radio.Button value={menu.id}>{menu.zhName}</Radio.Button>
          ))}
        </Radio.Group>
      </p>
      <p>
        <Carousel ref={carousel}>
          {data?.map((menu, index) => (
            <Tree
              key={menu.id}
              ref={(ref) => (tree.current[index] = ref)}
              checkable
              blockNode
              disabled={props.disabled}
              defaultCheckedKeys={props.defaultCheckedKeys}
              onCheck={(checked: any, info: any) => onCheck(menu.id, checked, info)}
              autoExpandParent>
              {renderTreeNode(menu.permissions || [])}
            </Tree>
          ))}
        </Carousel>
      </p>
    </div>
  );
}
