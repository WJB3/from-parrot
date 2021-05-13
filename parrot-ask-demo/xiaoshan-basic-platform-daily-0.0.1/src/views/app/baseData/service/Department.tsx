import { useRequest } from 'ahooks';
import React, { useRef } from 'react';
import api from 'src/api';
import OrgTreeSidebar from 'src/components/OrganizationSidebar';
import PrivateComponent from 'src/components/PrivateComponent';
import DepartmentList from './component/DepartmentList';
import DepartmentServiceList from './component/DepartmentServiceList';

export default function DepartmentTree() {
  const leader = useRef<any>();
  const teacher = useRef<any>();
  const { data: companyList } = useRequest( () => api.service.getCompany({current: -1, size: -1}).then((res)=> { return res.list}));
  return (
    <OrgTreeSidebar type={'department'}>
      {({ orgTree, refresh, node }) => (
        <div>
          {!node && (
            <PrivateComponent id={325}>
              <DepartmentList onRefresh={refresh} />{' '}
            </PrivateComponent>
          )}
          {/* 部门&&部门组显示组员列表 */}
          {node && (
            <PrivateComponent id={node.type === 1 ? 331 : 342}>
              <DepartmentServiceList
                node={node}
                orgTree={orgTree}
                companyList={companyList || []}
                onRefresh={() => {
                  leader.current?.refresh?.();
                }}
                onRef={(ref) => (teacher.current = ref)}
              />
            </PrivateComponent>
          )}
        </div>
      )}
    </OrgTreeSidebar>
  );
}