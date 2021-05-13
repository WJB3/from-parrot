import { useDebounceEffect, useRequest } from 'ahooks';
import { Input, Spin, Tree } from 'antd';
import { promises } from 'dns';
import React, { useRef, useState } from 'react';
import api from 'src/api';
import GT from 'types';
import IconFont from '../IconFont';
interface Teacher extends GT.Model.Teacher {
  key: any;
  type: string;
  title: string;
}
interface Org extends GT.Model.Organization {
  key: any;
  title: string;
  teachers: Teacher[];
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
export default function DepartmentMemberSelector(props: {
  onChange?: (data: SelectorData) => void;
  onRef?: (ref: Ref) => void;
  defaultCheckedKeys?: any[];
}) {
  const [teacherList, setTeacherList] = useState([] as GT.Model.Teacher[]);
  const [loading, setLoading] = useState(false);
  const { data: result } = useRequest(
    () =>
      Promise.all([
        api.service.getAllDepartment(),
        api.service.getPage({ current: -1, size: -1, flag: true }),
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
  const [data, services] = result || [];
  // const { data } = useRequest(api.organization.getTeacherTree, {
  //   onSuccess: () => {
  //     setCheckedKeys(props.defaultCheckedKeys || []);
  //     onCheck(tree.current.state.checkedKeys, {
  //       checkedNodes:
  //         tree.current.state.checkedKeys.map(
  //           (item: any) => tree.current.state.keyEntities[item]?.node,
  //         ) || [],
  //     });
  //   },
  // });
  const [expandedKeys, setExpandedKeys] = useState(['root']);
  const [checkedKeys, setCheckedKeys] = useState<any[]>();
  const [keyword, setKeyword] = useState('');
  const tree = useRef<any>();
  const renderTreeNode = (data: any[], parentId?: any) => {
    return data.map((item) => {
      item.key = item.id;
      let expanded = keyword && item.name.indexOf(keyword) > -1;
      return (
        <Tree.TreeNode
          key={item.id}
          style={{ display: keyword ? 'none' : 'flex' }}
          title={item.name}
          data={{ ...item, key: item.id, title: item.name, ...{ parentId } }}>
          {item.departments && renderTreeNode(item.departments, item.id)}
          {item.teachers && renderTeacherNode(item.teachers, item.id)}
        </Tree.TreeNode>
      );
    });
  };
  const renderSearchTeacherNode = (data: any[]) => {
    return data.map((item) => {
      const parentId = item.departmentIds?.[0] || -1;
      const key = `node,${parentId},${item.id}`;
      item.key = key;
      return (
        <Tree.TreeNode
          icon={<IconFont type='iconhuaban2'></IconFont>}
          key={key}
          className='selectMember_search_item'
          title={item.name}
          expanded
          data={{
            ...item,
            key,
            title: item.name,
            ...{ type: 'department', parentId },
          }}></Tree.TreeNode>
      );
    });
  };
  const renderTeacherNode = (data: any[], parentId: number) => {
    // 教师节点默认使用teacher前缀，方便后续编辑回显

    return data.map((item) => {
      const key = `node,${parentId},${item.id}`;
      item.key = key;
      let expanded = keyword && item.name.indexOf(keyword) > -1;

      return (
        <Tree.TreeNode
          icon={<IconFont type='iconhuaban2'></IconFont>}
          key={key}
          style={{ display: keyword ? 'none' : 'flex' }}
          title={item.name}
          expanded
          data={{
            ...item,
            key,
            title: item.name,
            ...{ type: 'department', parentId },
          }}></Tree.TreeNode>
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
      if (node.data.type === 'department') {
        nodes.push(node.data);
      }
      // 如果当前节点的父节点被选中，则当前节点不显示
      if (checkedMap.get(node.data.parentId && node.data.parentId.toString())) {
        continue;
      }
      if (node.data.type === 'department') {
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
      if (item.teachers) {
        arr = arr.concat(item.teachers.map((t) => t.key));
      }
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
  useDebounceEffect(
    () => {
      if (!keyword) {
        setTeacherList([]);
        setLoading(false);
        return;
      }
      api.teacher
        .getPage({
          name: keyword,
          size: -1,
          current: -1,
        })
        .then((res) => {
          setTeacherList(res.list);
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
          style={{ maxHeight: 300, overflow: 'auto', minHeight: 50 }}
          className='bg_transparent'
          checkable
          showIcon
          key={keyword}
          ref={tree}
          onCheck={onCheck}
          autoExpandParent
          checkedKeys={checkedKeys}
          expandedKeys={expandedKeys}
          onExpand={(expandedKeys: any) => setExpandedKeys(expandedKeys)}>
          {keyword ? renderSearchTeacherNode(teacherList) : null}
          <Tree.TreeNode
            key={'root'}
            style={{ display: keyword ? 'none' : 'flex' }}
            title={'全选'}
            data={{ key: 'root', title: '全选', ...{ departments: data, id: 'root' } }}>
            {renderTreeNode(data || [], 'root')}
            {/* 待分配老师，父节点约定为-1 */}
            {renderTeacherNode(services?.list || [], -1)}
          </Tree.TreeNode>
        </Tree>
      </Spin>
    </div>
  );
}
