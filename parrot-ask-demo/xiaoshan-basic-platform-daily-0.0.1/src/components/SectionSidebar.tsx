import React, { ReactNode, useMemo, useRef, useState } from 'react';
import { Row, Spin, Col, Tree } from 'antd';
import { useRequest, useWhyDidYouUpdate } from 'ahooks';
import api from 'src/api';
import GT from 'types';
import useApp from 'src/hook/useApp';
interface SectionTreeProps {
  children: (options: {
    tree: any[];
    node?: any;
    refresh: () => Promise<any[]>;
    selectNode: (key: any) => void;
  }) => ReactNode;
}
export default function SectionSidebar(props: SectionTreeProps) {
  const [node, setNode] = useState<any>();
  const { hasPermission } = useApp();
  const [selectedKeys, setSelectedKeys] = useState<any[]>();
  const [expandKeys, setExpandKeys] = useState<any[]>();
  const tree = useRef<any>();
  const { error, data: treeData = [], loading, refresh } = useRequest(
    () =>
      api.section.getTree({
        all: true,
      }),
    {
      onSuccess(res) {
        // 根据用户权限去默认显示对应的层级
        if (hasPermission(100)) {
        } else if (hasPermission(101)) {
          const section = res[0];
          if (section) {
            setNode(section);
            setSelectedKeys([`${section.sectionId}`]);
            setExpandKeys([`${section.sectionId}`]);
          }
        } else if (hasPermission(102)) {
          const grade = getFirstGrade(res);
          if (grade) {
            setNode(grade);
            setSelectedKeys([`${grade.parent.sectionId}-${grade.enrollmentYear}`]);
            setExpandKeys([`${grade.parent.sectionId}-${grade.enrollmentYear}`]);
          }
        } else if (hasPermission(103)) {
          const first = getFirstClass(res);
          if (first) {
            setNode(first);
            setSelectedKeys([
              `${first.parent.parent.sectionId}-${first.parent.enrollmentYear}-${first.classId}`,
            ]);
            setExpandKeys([
              `${first.parent.parent.sectionId}-${first.parent.enrollmentYear}-${first.classId}`,
            ]);
          }
        }
      },
    },
  );
  const selectNode = (key: any) => {
    setNode(tree.current?.state?.keyEntities?.[key].node.data);
    const keys = key.split('-');
    const expandKeys = keys.reduce((arr: any[], item: any) => {
      arr.push([...arr, item].join('-'));
      return arr;
    }, []);
    setExpandKeys(expandKeys);
    setSelectedKeys([key]);
  };
  const content = useMemo(() => props.children({ tree: treeData, node, refresh, selectNode }), [
    node,
    treeData,
    refresh,
  ]);
  const getFirstGrade = (data: any[]) => {
    const grades = data.reduce((arr, item) => {
      arr = arr.concat(item.nodes);
      return arr;
    }, []);
    return grades[0];
  };
  const getFirstClass = (data: any[]) => {
    const grades: any[] = data.reduce((arr, item) => {
      arr = arr.concat(item.nodes);
      return arr;
    }, []);
    const classes = grades.reduce((arr, item) => {
      arr = arr.concat(item.nodes);
      return arr;
    }, []);
    return classes[0];
  };
  const onSelect = (selectedKeys: any[], info: any) => {
    setNode(info.selectedNodes[0]?.data || null);
    setSelectedKeys(selectedKeys);
  };

  const renderTreeNode = (data: any[], prefix?: number, parent?: any) => {
    /**
     * 由于年段，年级，班级存在id重复的情况，这里使用 年段-年级-班级 作为key值
     */
    return data.map((item) => {
      const key = !prefix
        ? item.sectionId || item.enrollmentYear || item.classId
        : `${prefix}-${item.sectionId || item.enrollmentYear || item.classId}`;
      const title = item.sectionName || item.gradeName || item.className;
      /**
       * 挂上parent,方便数据的处理
       */
      item.parent = parent;
      return (
        <Tree.TreeNode key={key} title={title} data={{ ...item, key, title, parent }}>
          {item.nodes && renderTreeNode(item.nodes, key, item)}
        </Tree.TreeNode>
      );
    });
  };
  return loading ? (
    <Row justify='center'>
      <Spin style={{ marginTop: '30vh' }} spinning={loading} size='large'></Spin>
    </Row>
  ) : (
    <div style={{ height: '100%', overflowX: 'hidden' }}>
      <Row gutter={20} style={{ height: '100%' }}>
        <Col span={4} style={{ background: '#F2F4FB' }}>
          <Tree
            onSelect={onSelect}
            blockNode
            ref={(ref) => (tree.current = ref)}
            expandedKeys={expandKeys}
            onExpand={(keys) => setExpandKeys(keys)}
            className='bg_transparent'
            selectedKeys={selectedKeys}>
            {renderTreeNode(treeData)}
          </Tree>
        </Col>
        <Col span={20}>{content}</Col>
      </Row>
    </div>
  );
}
