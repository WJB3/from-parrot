import { useRequest } from 'ahooks';
import { Spin, Tree } from 'antd';
import React, { useRef, useState } from 'react';
import api from 'src/api';
import GT from 'types';

interface Org extends GT.Model.Organization {
  key: any;
  title: string;
  departments: Org[];
  count: number;
}
export interface SelectorData {
  nodes: any[];
  views: {
    nodes: any[];
    groups: any[];
  };
}
export interface Ref {
  unCheckedNode: (node: Org) => void;
  unCheckedAll: () => void;
}
export default function BranchMemberSelector(props: {
  onChange?: (data: SelectorData) => void;
  onRef?: (ref: Ref) => void;
  defaultCheckedKeys?: any[];
}) {
  // const [loading, setLoading] = useState(false);
  const { data: result } = useRequest(
    () => api.organization.getTeacherTree(),
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
        // setLoading(false);
      },
    },
  );
  const [expandedKeys, setExpandedKeys] = useState(['root']);
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]);
  const tree = useRef<any>();
  const renderTreeNode = (data: any[], parentId?: any) => {
    return data.map((item) => {
      item.key = `${item.id}`;
      return (
        <Tree.TreeNode
          key={item.key}
          style={{ display: 'flex' }}
          title={item.name}
          data={{ ...item, key: item.key, title: item.name, ...{ parentId } }}>
          {item.departments && renderTreeNode(item.departments, item.id)}
        </Tree.TreeNode>
      );
    });
  };

  const getCount = (data: Org[]) => {
    return data.reduce((count, item) => {
      if (item.teachers) {
        count += item.teachers.length;
      }
      if (item.departments) {
        count += getCount(item.departments);
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
      if (node.data.type === 2) {
        nodes.push(node.data);
      }
      // 如果当前节点的父节点被选中，则当前节点不显示
      if (checkedMap.get(node.data.parentId && node.data.parentId.toString())) {
        continue;
      }
      if (node.data.type === 2) {
        views.nodes.push(node.data);
      } else {
        const count = getCount([node.data]);
        if (count) {
          views.groups.push({
            ...node.data,
            count,
          });
        }
      }
    }
    props.onChange?.({
      nodes,
      views,
    });
  };
  // 获取某个节点的所有子key
  const getKeys = (data: Org[]) => {
    return data.reduce((arr, item) => {
      arr.push(item.key.toString());
      if (item.departments) {
        arr = arr.concat(getKeys(item.departments));
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
      keys.forEach((key) => {
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
      {/* <Spin spinning={loading}> */}
        <Tree
          blockNode
          className='bg_transparent'
          checkable
          showIcon
          ref={tree}
          style={{ maxHeight: 300, overflow: 'auto', minHeight: 50 }}
          onCheck={onCheck}
          autoExpandParent
          checkedKeys={checkedKeys}
          expandedKeys={expandedKeys}
          onExpand={(expandedKeys: any) => setExpandedKeys(expandedKeys)}>
          <Tree.TreeNode
            key={'root'}
            title={'全选'}
            style={{ display: 'flex' }}
            data={{ key: 'root', title: '全选', ...{ departments: result, id: 'root' } }}>
            {renderTreeNode(result || [], 'root')}
            {/* 待分配老师，父节点约定为-1 */}
            {/* {renderTeacherNode(teachers?.list || [], -1)} */}
          </Tree.TreeNode>
        </Tree>
      {/* </Spin> */}
    </div>
  );
}
