import { useRequest } from 'ahooks';
import { Button, Col, Row, Spin, Tree } from 'antd';
import React, { ReactNode, useMemo, useState } from 'react';
import api from 'src/api';
import GT from 'types';
interface Props {
  children: (options: { node?: GT.Model.Dictionary; refresh: () => Promise<any[]> }) => ReactNode;
}
export default function DictionarySidebar(props: Props) {
  const [node, setNode] = useState<any>();
  const [selectedKeys, setSelectedKeys] = useState<any[]>();
  const [expandKeys, setExpandKeys] = useState<any[]>([-3, -2, -1]);
  const { data, loading, refresh } = useRequest(() =>
    Promise.all([
      api.dictionary.getPage({
        params: {
          size: -1,
          current: -1,
          defaultStatus: 0,
        },
      }),
      api.dictionary.getPage({
        params: {
          size: -1,
          current: -1,
          defaultStatus: 1,
        },
      }),
    ]),
  );
  const [defaultList, customList] = data || [];
  const onSelect = (selectedKeys: any[], info: any) => {
    setNode(info.selectedNodes[0]?.data || null);
    setSelectedKeys(selectedKeys);
  };

  const content = useMemo(() => props.children({ node, refresh }), [node, refresh]);
  const renderTreeNode = (data: GT.Model.Dictionary[], defaultStatus?: 0 | 1) => {
    return data.map((item) => {
      const key = item.id;
      item.defaultStatus = defaultStatus;
      return (
        <Tree.TreeNode
          key={key}
          title={item.dicName}
          data={{ key: key, title: item.dicName, ...item }}></Tree.TreeNode>
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
            expandedKeys={expandKeys}
            onExpand={(keys) => setExpandKeys(keys)}
            className='bg_transparent'
            selectedKeys={selectedKeys}>
            <Tree.TreeNode title={'全部'} key={-3} data={{ ...{ id: -3 }, title: '全部', key: -3 }}>
              <Tree.TreeNode
                title={'系统默认字典'}
                key={-2}
                data={{ title: '全部', key: -2, ...{ id: -2 } }}>
                {renderTreeNode(defaultList?.list || [], 0)}
              </Tree.TreeNode>
              <Tree.TreeNode
                title={'可定义字典'}
                key={-1}
                data={{ title: '全部', key: -1, ...{ id: -1 } }}>
                {renderTreeNode(customList?.list || [], 1)}
              </Tree.TreeNode>
            </Tree.TreeNode>
            {/* {renderTreeNode(treeData)} */}
          </Tree>
        </Col>
        <Col span={20}>{content}</Col>
      </Row>
    </div>
  );
}
