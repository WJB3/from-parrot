import { useRequest } from 'ahooks';
import { Input, Tree } from 'antd';
import React, { useRef, useState } from 'react';
import api from 'src/api';
import useDictionary from 'src/hook/useDictionary';
import GT from 'types';
import IconFont from '../IconFont';
export interface Ref {
  unCheckedNode: (node: any) => void;
  unCheckedAll: () => void;
}
export default function GroupMemberSelector(props: {
  onChange?: (data: any) => void;
  onRef?: (ref: Ref) => void;
  defaultCheckedKeys?: any[];
  type: 'lesson' | 'custom';
  customQuery?: any;
}) {
  const { data } = useRequest(
    () =>
      Promise.all([
        api.group.getPage({
          params: {
            ...{ current: -1, size: -1 },
            ...props.customQuery,
          },
        }),
        api.group.getLessonGroupPage({
          current: -1,
          size: -1,
        }),
      ]),
    {
      onSuccess: () => {
        setCheckedKeys(props.defaultCheckedKeys || []);
        onCheck(tree.current.state.checkedKeys, {
          checkedNodes:
            tree.current.state.checkedKeys.map(
              (item: any) => tree.current.state.keyEntities[item]?.node,
            ) || [],
        });
      },
    },
  );
  const [custom, lesson] = data || [];
  const [expandedKeys, setExpandedKeys] = useState(['root']);
  const [checkedKeys, setCheckedKeys] = useState<any[]>();
  const { renderText } = useDictionary();
  const [keyword, setKeyword] = useState('');
  const tree = useRef<any>();
  const getSectionName = (val: any) => {
    const map: any = {
      1: '高中',
      2: '初中',
      3: '预备',
    };
    return map[val];
  };
  const renderTreeNode = (data: any[], parentId?: any, type?: string) => {
    return data.map((item) => {
      item.key = item.id;
      item.name =
        item.name ||
        `${getSectionName(item.sectionType)}/${item.enrollmentYear}届/${renderText(
          `subject${item.sectionType}`,
          item.subjectId,
        )}`;
      let icon;
      if (type) {
        item.key = item.number
          ? `node,${parentId},${item.memberId},${item.number}`
          : `node,${parentId},${item.memberId}`;
        item.type = type;
        icon = <IconFont type='iconhuaban2'></IconFont>;
      }
      let expanded = keyword && item.name.indexOf(keyword) > -1;
      return (
        <Tree.TreeNode
          key={item.key}
          style={{ display: expanded || !keyword ? 'flex' : 'none' }}
          title={expanded ? <span style={{ color: 'red' }}>{item.name}</span> : item.name}
          icon={icon}
          data={{ ...item, title: item.name, ...{ parentId } }}>
          {item.nodes && renderTreeNode(item.nodes, item.id)}
          {item.members && renderTreeNode(item.members, item.id, 'member')}
        </Tree.TreeNode>
      );
    });
  };
  const list = [
    {
      id: 'root',
      name: '全选',
      nodes: [
        {
          id: 'lesson',
          name: '备课组',
          nodes: lesson?.list || [],
        },
      ],
    },
  ];
  if (props.type === 'custom') {
    list[0].nodes.push({
      id: 'custom',
      name: '自定义群组',
      nodes: custom?.list || [],
    });
  }
  const getCount = (data: any[]) => {
    return data.reduce((count, item) => {
      if (item.members) {
        count += item.members.length;
      }
      if (item.nodes) {
        count += getCount(item.nodes);
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
      if (node.data.type === 'member') {
        nodes.push(node.data);
      }
      // 如果当前节点的父节点被选中，则当前节点不显示
      if (checkedMap.get(node.data.parentId && node.data.parentId.toString())) {
        continue;
      }
      if (node.data.type === 'member') {
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
  const getKeys = (data: any[]) => {
    return data.reduce((arr, item) => {
      arr.push(item.key.toString());
      if (item.members) {
        arr = arr.concat(item.members.map((t: any) => t.key));
      }
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
  const onKeywordChange = (e: any) => {
    setKeyword(e.target.value);
    if (!e.target.value) {
      setExpandedKeys(['root']);
      return;
    }
    const { keyEntities } = tree.current.state;
    const keys = Object.keys(keyEntities);
    let entities = keys.map((key) => keyEntities[key].node);
    let selected = entities.filter((node) => {
      return node.data?.title?.indexOf(e.target.value) > -1;
    });
    setExpandedKeys(selected.map((node) => node.key));
  };
  return (
    <div style={{ paddingRight: 20 }}>
      {/* <p>
        <Input placeholder='请输入' onChange={onKeywordChange} allowClear></Input>
      </p> */}
      <Tree
        blockNode
        style={{ maxHeight: 300, overflow: 'auto' }}
        className='bg_transparent'
        checkable
        showIcon
        ref={tree}
        autoExpandParent
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        expandedKeys={expandedKeys}
        onExpand={(expandedKeys: any) => setExpandedKeys(expandedKeys)}>
        {renderTreeNode(list || [])}
      </Tree>
    </div>
  );
}
