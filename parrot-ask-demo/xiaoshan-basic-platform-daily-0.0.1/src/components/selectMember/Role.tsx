import { useRequest } from 'ahooks';
import { Tree } from 'antd';
import React, { useRef, useState } from 'react';
import api from 'src/api';
import IconFont from '../IconFont';
export interface Ref {
  unCheckedNode: (node: any) => void;
  unCheckedAll: () => void;
}
export default function RoleMemberSelector(props: {
  onChange?: (data: any) => void;
  onRef?: (ref: Ref) => void;
  defaultCheckedKeys?: any[];
}) {
  const { data } = useRequest(
    () =>
      api.role.getCustom(),
    {
      onSuccess: () => {
        const keys = props.defaultCheckedKeys?.map((e) => `${e}`);
        setCheckedKeys(keys || []);
        onCheck(tree.current.state.checkedKeys, {
          checkedNodes:
            tree.current.state.checkedKeys.map(
              (item: any) => tree.current.state.keyEntities[item]?.node,
            ) || [],
        });
      },
    },
  );
  const [checkedKeys, setCheckedKeys] = useState<any[]>();
  const tree = useRef<any>();
  const renderTreeNode = (data: any[], checkable = true, parentId?: any,) => {
    return data.map((item) => {
      item.key = `${item.id}`;
      item.name = item.zhName;
      return (
        <Tree.TreeNode
          checkable={checkable}
          expanded
          key={item.key}
          style={{ display:  'flex' }}
          title={item.name}
          icon={ checkable ? <IconFont type='iconhuaban2'></IconFont> : null}
          data={{ ...item, title: item.name, ...{ parentId } }}>
          {item.nodes && renderTreeNode(item.nodes, item.id)}
        </Tree.TreeNode>
      );
    });
  };
  const getCount = (data: any[]) => {
    return data.reduce((count, item) => {
      if (item.nodes) {
        count += getCount(item.nodes);
      } else {
        count += item.count;
      }
      return count;
    }, 0);
  };
  const onCheck = (keys: any, info: any) => {
    setCheckedKeys(keys);
    const checkedMap = new Map();
    keys.forEach((key: number | string) => {
      checkedMap.set(key, true);
    });
    const nodes: any[] = [];
    const views: any = {
      groups: [],
      nodes: [],
    };
    for (let i = 0, max = info.checkedNodes.length; i < max; i++) {
      let node = info.checkedNodes[i];
      // debugger;
      nodes.push(node.data);
      const count = getCount([node.data]);
      if (count) {
        views.groups.push({
          ...node.data,
          count,
        });
      }
    }
    props.onChange?.({
      nodes,
      views,
    });
  };
  const getKeys = (data: any[]) => {
    return data.reduce((arr, item) => {
      arr.push(item.key.toString());
      // if (item.members) {
      //   arr = arr.concat(item.members.map((t: any) => t.key));
      // }
      if (item.nodes) {
        arr = arr.concat(getKeys(item.nodes));
      }
      return arr;
    }, [] as any[]);
  };
  props.onRef?.({
    unCheckedAll: () => {
      setCheckedKeys([]);
      onCheck([], {
        checkedNodes: [],
      });
    },
    unCheckedNode: (node) => {
      const map = new Map<string, boolean>();
      let keys = getKeys([node]);
      keys.forEach((key: any) => {
        map.set(key, true);
      });
      const current = checkedKeys?.filter((key) => !map.get(key));
      onCheck(current, {
        checkedNodes: current?.map((item) => tree.current.state.keyEntities[item]?.node) || [],
      });
    },
  });

  return (
    <div style={{ paddingRight: 20 }}>
      <Tree
        blockNode
        style={{ maxHeight: 300, overflow: 'auto' }}
        className='bg_transparent'
        checkable
        showIcon
        ref={tree}
        autoExpandParent
        defaultExpandAll
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        >
          {data && renderTreeNode([{
          id: 'sys',
          zhName: '系统角色',
          nodes: data.sysRoles || [],
        }, {
          id: 'custom',
          zhName: '自定义角色',
          nodes: data.customRoles || [],
        }], false)}
      </Tree>
    </div>
  );
}
