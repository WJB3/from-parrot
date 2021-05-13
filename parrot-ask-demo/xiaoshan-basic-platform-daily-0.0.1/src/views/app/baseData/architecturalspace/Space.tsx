import React from 'react';
import BuildingSidebar from 'src/components/BuildingSidebar';
import SpaceList from './component/SpaceList';

export default function SpacePage() {
  return (
    <BuildingSidebar type='space'>
      {({ node, refresh, selectNode }) => (
        <div>{node?.type === 0 && <SpaceList campusId={node.id}></SpaceList>}</div>
      )}
    </BuildingSidebar>
  );
}
