import React from 'react';
import BuildingSidebar from 'src/components/BuildingSidebar';
import PrivateComponent from 'src/components/PrivateComponent';
import BuildingDetail from './component/BuildingDetail';
import BuildingList from './component/BuildingList';

export default function BuildingPage() {
  return (
    <BuildingSidebar>
      {({ node, refresh, selectNode }) => (
        <div>
          {node?.type === 0 && (
            <BuildingList
              campusId={node.id}
              onRefresh={refresh}
              onCheck={(record) => {
                selectNode({
                  id: record.id,
                  name: record.name,
                  type: 1,
                  parentId: node.id,
                });
              }}></BuildingList>
          )}
          {node?.type === 1 && (
            <PrivateComponent id={186}>
              <BuildingDetail id={node.id}></BuildingDetail>
            </PrivateComponent>
          )}
        </div>
      )}
    </BuildingSidebar>
  );
}
