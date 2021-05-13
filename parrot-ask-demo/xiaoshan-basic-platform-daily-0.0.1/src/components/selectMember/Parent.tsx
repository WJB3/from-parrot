import { useRequest, useDebounceEffect } from 'ahooks';
import { Input, Spin, Tree } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import api from 'src/api';
import GT from 'types';
import IconFont from '../IconFont';

export interface SelectorData {
  nodes: any[];
  views: {
    nodes: any[];
    groups: any[];
  };
}
export interface Ref {
  unCheckedNode: (node: any) => void;
  unCheckedAll: () => void;
}
export default function ParentMemberSelector(props: {
  onChange?: (data: SelectorData) => void;
  onRef?: (ref: Ref) => void;
  defaultCheckedKeys?: any[];
}) {
  const [parents, setParents] = useState<GT.Model.Student[]>([]);
  const [loading, setLoading] = useState(false);
  const { data } = useRequest(
    () =>
      api.section.getTree({
        all: false,
        containStudents: true,
        containParents: true,
      }),
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
  const tree = useRef<any>();
  const [checkedKeys, setCheckedKeys] = useState<any[]>();
  const [expandedKeys, setExpandedKeys] = useState<any[]>(['root']);
  const [keyword, setKeyword] = useState('');
  const renderTreeNode = (data: any[], prefix?: any, studentId?: any) => {
    /**
     * 由于年段，年级，班级存在id重复的情况，这里使用 年段-年级-班级 作为key值
     */
    return data.map((item) => {
      const id = item.id || item.sectionId || item.enrollmentYear || item.classId;
      const key = !prefix ? id : `${prefix},${id}`;
      const title = item.name || item.sectionName || item.gradeName || item.className;
      /**
       * 挂上parent,方便数据的处理
       */
      item.key = key;
      item.parentId = prefix;
      let icon;
      // 如果是家长，特殊处理 id = node,
      if (studentId) {
        item.type = 'parent';
        item.key = `node,${studentId},${item.number}`;
        icon = <IconFont type='iconhuaban3'></IconFont>;
      }
      let expanded = keyword && title.indexOf(keyword) > -1;
      return (
        <Tree.TreeNode
          key={item.key}
          icon={icon}
          style={{ display: keyword ? 'none' : 'flex' }}
          title={expanded ? <span style={{ color: 'red' }}>{title}</span> : title}
          data={{ ...item, title, studentId }}>
          {item.nodes && renderTreeNode(item.nodes, key)}
          {item.students && renderTreeNode(item.students, key)}
          {item.parents && renderTreeNode(item.parents, key, item.id)}
        </Tree.TreeNode>
      );
    });
  };
  const renderSearchNode = (data: any[]) => {
    return data.map((item) => {
      return item.parents?.map((parent: any) => {
        parent.key = `node,${item.id},${parent.number}`;
        parent.type = 'parent';
        const title = parent.name;
        return (
          <Tree.TreeNode
            className='selectMember_search_item'
            key={parent.key}
            icon={<IconFont type='iconhuaban3'></IconFont>}
            title={title}
            data={{ ...parent, title, studentId: item.id }}></Tree.TreeNode>
        );
      });
    });
  };
  const getCount = (data: any[]) => {
    return data.reduce((count, item) => {
      if (item.parents) {
        count += item.parents.length;
      }
      if (item.nodes) {
        count += getCount(item.nodes);
      }
      if (item.students) {
        count += getCount(item.students);
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
      if (node.data.type === 'parent') {
        nodes.push(node.data);
      }
      // 如果当前节点的父节点被选中，则当前节点不显示
      if (checkedMap.get(node.data.parentId && node.data.parentId.toString())) {
        continue;
      }
      if (node.data.type === 'parent') {
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
  const getKeys = (data: any[]) => {
    return data.reduce((arr, item) => {
      arr.push(item.key.toString());
      if (item.parents) {
        arr = arr.concat(item.parents.map((t: any) => t.key));
      }
      if (item.students) {
        arr = arr.concat(getKeys(item.students));
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
      let keys: string[] = getKeys([node]);
      keys.forEach((key) => {
        map.set(key, true);
      });
      const current = checkedKeys?.filter((key) => !map.get(key));
      setCheckedKeys(current);
      onCheck(current, {
        checkedNodes: current?.map((item) => tree.current.state.keyEntities[item]?.node) || [],
      });
    },
  });
  useDebounceEffect(
    () => {
      if (!keyword) {
        setParents([]);
        setLoading(false);
        return;
      }
      api.student
        .getPage({
          name: keyword,
          size: -1,
          current: -1,
          scope: 2,
        })
        .then((res) => {
          setParents(res.list.filter((s) => s.parents?.length));
          setLoading(false);
        });
    },
    [keyword],
    {
      wait: 500,
    },
  );
  const onKeywordChange = (e: any) => {
    setKeyword(e.target.value);
    if (e.target.value) {
      setLoading(true);
    }
    // if (!e.target.value) {
    //   setExpandedKeys(['root']);
    //   return;
    // }
    // const { keyEntities } = tree.current.state;
    // const keys = Object.keys(keyEntities);
    // let entities = keys.map((key) => keyEntities[key].node);
    // let selected = entities.filter((node) => {
    //   return node.data?.title?.indexOf(e.target.value) > -1;
    // });
    // setExpandedKeys(selected.map((node) => node.key));
  };
  return (
    <div style={{ paddingRight: 20 }}>
      <p>
        <Input placeholder='请输入' onChange={onKeywordChange} allowClear></Input>
      </p>
      <Spin spinning={loading}>
        <Tree
          blockNode
          className='bg_transparent'
          key={keyword}
          style={{ maxHeight: 300, overflow: 'auto', minHeight: 50 }}
          checkable
          showIcon
          ref={tree}
          onCheck={onCheck}
          autoExpandParent
          checkedKeys={checkedKeys}
          expandedKeys={expandedKeys}
          onExpand={(keys: any) => {
            setExpandedKeys(keys);
          }}>
          {keyword ? renderSearchNode(parents) : null}
          <Tree.TreeNode
            key={'root'}
            title={'全选'}
            style={{ display: keyword ? 'none' : 'flex' }}
            data={{ key: 'root', title: '全选', ...{ id: 'root', nodes: data } }}>
            {renderTreeNode(data || [], 'root')}
          </Tree.TreeNode>
        </Tree>
      </Spin>
    </div>
  );
}
