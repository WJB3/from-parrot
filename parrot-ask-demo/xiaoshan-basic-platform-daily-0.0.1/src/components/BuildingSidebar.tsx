import React, { ReactNode, useMemo, useRef, useState } from 'react';
import { Row, Spin, Col, Tree, Button } from 'antd';
import { useRequest } from 'ahooks';
import api from 'src/api';
import GT from 'types';
import useApp from 'src/hook/useApp';
import CreateCampusModal from 'src/views/app/baseData/architecturalspace/component/CreateCampus';
import PrivateComponent from './PrivateComponent';
interface Props {
  type: 'building' | 'space';
  children: (options: {
    tree: GT.Model.BuildingTreeNode[];
    node?: GT.Model.BuildingTreeNode;
    refresh: () => Promise<any[]>;
    selectNode: (node: GT.Model.BuildingTreeNode) => void;
  }) => ReactNode;
}
export default function BuildingSidebar(props: Props) {
  const [node, setNode] = useState<any>();
  const [selectedKeys, setSelectedKeys] = useState<any[]>();
  const [expandKeys, setExpandKeys] = useState<any[]>();
  const modal = useRef<GT.Modal.Ref>();
  const { error, data: treeData = [], loading, refresh } = useRequest(
    props.type === 'building' ? api.building.getBuildingTree : api.building.getSpaceTree,
    {
      onSuccess(res) {
        if (res?.length && !node) {
          setNode(res[0]);
          setSelectedKeys([`${res[0].id}`]);
          setExpandKeys([`${res[0].id}`]);
        } else {
          setSelectedKeys([`${node.id}`]);
          setExpandKeys([`${node.id}`]);
        }
      },
    },
  );
  const selectNode = (node: GT.Model.BuildingTreeNode) => {
    setNode(node);
    setSelectedKeys([node.parentId ? `${node.parentId}-${node.id}` : `${node.id}`]);
  };
  const content = useMemo(() => props.children({ tree: treeData, node, refresh, selectNode }), [
    node,
    treeData,
    refresh,
  ]);
  const onSelect = (selectedKeys: any[], info: any) => {
    setNode(info.selectedNodes[0]?.data || null);
    setSelectedKeys(selectedKeys);
  };

  const renderTreeNode = (data: GT.Model.BuildingTreeNode[], prefix?: string) => {
    return data.map((item) => {
      const key = !prefix ? `${item.id}` : `${prefix}-${item.id}`;

      return (
        <Tree.TreeNode
          key={key}
          title={item.name}
          data={{ key: key, title: item.name, ...item }}
          selectable={!(props.type === 'space' && item.type === 1)}>
          {item.list && renderTreeNode(item.list, key)}
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
          <Row style={{ padding: 10 }} justify='center'>
            <Button
              type='primary'
              onClick={() => modal.current?.setVisible(true)}
              style={{ width: '90%' }}>
              新增校区
            </Button>
          </Row>
          <Tree
            onSelect={onSelect}
            blockNode
            expandedKeys={expandKeys}
            autoExpandParent
            onExpand={(keys) => setExpandKeys(keys)}
            className='bg_transparent'
            selectedKeys={selectedKeys}>
            {renderTreeNode(treeData)}
          </Tree>
        </Col>
        <Col span={20}>{content}</Col>
      </Row>
      <CreateCampusModal onRef={(ref) => (modal.current = ref)} onOk={refresh}></CreateCampusModal>
    </div>
  );
}

BuildingSidebar.defaultProps = {
  type: 'building',
};
