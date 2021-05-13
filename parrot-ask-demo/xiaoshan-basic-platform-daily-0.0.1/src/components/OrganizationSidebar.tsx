import React, { useState, ReactNode } from 'react';
import { Row, Col, Spin, Tree } from 'antd';
import { useRequest } from 'ahooks';
import api from 'src/api';
import GT from 'types';
interface OrgTreeProps {
  children: (options: {
    orgTree: GT.Model.Organization[];
    node?: GT.Model.Organization|null;
    refresh: () => Promise<GT.Model.Organization[]>;
  }) => ReactNode;
}
export default function OrgTreeSidebar(props: OrgTreeProps & {type: 'organization' | 'department';}) {
  const [node, setNode] = useState<GT.Model.Organization|null>();
  const { error, data: treeData = [], loading, refresh } = useRequest(
    (props.type == 'organization' ?  api.organization.getAll : api.service.getAllDepartment)
  );

  const onSelect = (selectedKeys: any[], info: any) => {
    console.log("info",info);
    if(info.node.key==="0"){
      setNode(null)
      return ;
    } 
    setNode(info.selectedNodes[0]?.data || null);
  };
  const renderTreeNode = (data: GT.Model.Organization[]) => {
    // console.log("00treeData00",data)
    if(data[0].name==="校领导及中层"){
      data.splice(0,0,{
        defaultState: 0,
        id: 0,
        name: "全部",
        roleId: -1,
        sort: -1,
        type: 1
      })
    }
    return data.map((item) => (
      <Tree.TreeNode
        key={item.id}
        title={item.name}
        data={{ ...item, key: item.id, title: item.name }}>
        {item.departments && renderTreeNode(item.departments)}
      </Tree.TreeNode>
    ));
  };

  console.log("setNode",node)
 

  return loading ? (
    <Row justify='center'>
      <Spin style={{ marginTop: '30vh' }} spinning={loading} size='large'></Spin>
    </Row>
  ) : (
    <div style={{ height: '100%', overflowX: 'hidden' }}>
      <Row gutter={20} style={{ height: '100%' }}>
        <Col span={4} style={{ background: '#F2F4FB' }}>
          <Tree onSelect={onSelect} blockNode className='bg_transparent' height={500}>
            {renderTreeNode(treeData)}
          </Tree>
        </Col>
        <Col span={20}>{props.children({ orgTree: treeData, refresh, node })}</Col>
      </Row>
    </div>
  );
}
