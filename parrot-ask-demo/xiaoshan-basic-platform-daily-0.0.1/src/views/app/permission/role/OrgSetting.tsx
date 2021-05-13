import React from 'react';
import OrgTreeSidebar from 'src/components/OrganizationSidebar';
import RoleSetting from './component/RoleSetting';
export default function OrgSettingPage() {
  return (
    <OrgTreeSidebar type={'organization'}>
      {({ orgTree, refresh, node }) =>
        node?.type === 2 && <RoleSetting roleId={node.roleId}></RoleSetting>
      }
    </OrgTreeSidebar>
  );
}
