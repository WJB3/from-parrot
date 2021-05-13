import React, { useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import api from 'src/api';
import { Tree, Row, Space, Button, Modal, message } from 'antd';
import { DataNode } from 'antd/lib/tree';
import GT from 'types';
import CreatePermissionModal from './component/CreatePermission';
export default function PermissionTree() {
  const ref = useRef<any>();
  const modal = useRef<GT.Modal.Ref>();
  const [expandKeys, setExpandKeys] = useState<any[]>();
  const { data = [], loading, refresh } = useRequest(() =>
    api.permission.getPermissions({ style: 1 }),
  );
  const titleRender = (node: DataNode, a?: any) => {
    const selectedKeys = ref.current?.state?.selectedKeys || [];
    const content = (
      <Space>
        <Button type='link' size='small' onClick={() => onCreate(node)}>
          新增子节点
        </Button>
        <Button type='link' size='small' onClick={() => onEdit(node)}>
          编辑
        </Button>
        {(!node.children || !node.children.length) && (
          <Button type='link' danger size='small' onClick={() => onDelete(node)}>
            删除
          </Button>
        )}
      </Space>
    );
    return (
      <Row justify='space-between'>
        {node.title} {selectedKeys.includes(node.key) && content}
      </Row>
    );
  };
  // 删除权限配置
  const onDelete = (node: DataNode) => {
    Modal.confirm({
      title: '删除',
      content: `确认删除${node.title}权限配置？`,
      onOk: () => {
        api.permission.delete(node.key).then(() => {
          message.success('删除成功');
          refresh();
        });
      },
    });
  };
  const onCreate = (node?: any) => {
    modal.current?.setVisible(true);
    modal.current?.form?.setFieldsValue({
      parentId: node?.data?.id,
      target: 1,
      sort: 1,
    });
  };
  const onEdit = (node: any) => {
    modal.current?.setTitle('编辑节点');
    modal.current?.form?.setFieldsValue({
      ...node?.data,
      iconUrl: node?.data?.iconUrl ? [{ url: node.data.iconUrl, uid: 1 }] : [],
    });
    modal.current?.setVisible(true);
  };
  const renderTreeNode = (data: GT.Model.Menu[]) => {
    return data.map((item) => (
      <Tree.TreeNode
        key={item.id}
        title={`${item.zhName}(${item.name}/${item.id})`}
        data={{ ...item, key: item.id }}>
        {item.permissions && renderTreeNode(item.permissions)}
      </Tree.TreeNode>
    ));
  };
  const onExpand = (keys: any[]) => {
    setExpandKeys(keys);
  };
  return (
    <div>
      <p>
        <Button type='primary' onClick={() => onCreate()}>
          新增根节点
        </Button>
      </p>
      {!loading && (
        <Tree
          ref={ref}
          key={'id'}
          blockNode
          onExpand={onExpand}
          titleRender={titleRender}
          defaultExpandedKeys={expandKeys}>
          {renderTreeNode(data)}
        </Tree>
      )}
      <CreatePermissionModal
        treeData={data}
        onOk={() => refresh()}
        onRef={(ref: GT.Modal.Ref) => {
          modal.current = ref;
        }}></CreatePermissionModal>
    </div>
  );
}
