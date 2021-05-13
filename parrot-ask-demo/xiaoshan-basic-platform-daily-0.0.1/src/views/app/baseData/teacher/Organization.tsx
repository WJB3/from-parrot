//@ts-nocheck
import React, { useRef } from 'react';
import OrgList from './component/OrgList';
import OrgTeacherList from './component/OrgTeacherList';
import OrgTreeSidebar from 'src/components/OrganizationSidebar';
import OrgLeader from './component/OrgLeader';
import PrivateComponent from 'src/components/PrivateComponent';
export default function OrgTree() {
  const leader = useRef<any>();
  const teacher = useRef<any>();
  return (
    <OrgTreeSidebar type={'organization'}>
      {({ orgTree, refresh, node }) => (
        <div>
          {((node && (node.type === 2 || node.type === 1))) && (
            <PrivateComponent id={242}>
              <p>
                <OrgLeader
                  node={node}
                  onRefresh={() => {
                    teacher.current?.refresh?.();
                  }}
                  onRef={(ref) => (leader.current = ref)}></OrgLeader>
              </p>
            </PrivateComponent>
          )}

          {!node && (
            <PrivateComponent id={225}>
              <OrgList orgTree={orgTree} onRefresh={refresh} />
            </PrivateComponent>
          )}
          {/* 部门组显示部门列表 */}
          {node && node.type === 1 && (
            <PrivateComponent id={231}>
              <OrgList node={node} id={node.id} orgTree={orgTree} onRefresh={refresh} />
            </PrivateComponent>
          )}
        
          {/* 部门&&部门组显示组员列表 */}
          {node && (
            <PrivateComponent id={node.type === 1 ? 231 : 242}>
              <OrgTeacherList
                node={node}
                orgTree={orgTree}
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
