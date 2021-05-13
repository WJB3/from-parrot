import React, { useEffect } from 'react';
import PageTab from 'src/components/PageTab';
import PrivateComponent from 'src/components/PrivateComponent';
import BuildingPage from './Building';
import SpacePage from './Space';
export default function ArchitecturalspacePage() {
  return (
    <PageTab>
      {({ id, pageId, tab }) => (
        <div>
          <PrivateComponent id={148}>
            {tab === '148' && <BuildingPage></BuildingPage>}
          </PrivateComponent>
          <PrivateComponent id={149}>{tab === '149' && <SpacePage></SpacePage>}</PrivateComponent>
        </div>
      )}
    </PageTab>
  );
}
