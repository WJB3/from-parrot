import React from 'react';
import PageTab from 'src/components/PageTab';
import PrivateComponent from 'src/components/PrivateComponent';
import LessonGroup from './LessonGroup';
import CustomGroup from './CustomGroup';
export default function GroupPage() {
  return (
    <PageTab>
      {({ pageId, id, tab }) => (
        <div>
          <PrivateComponent id={66}>{tab === '66' && <LessonGroup></LessonGroup>}</PrivateComponent>
          <PrivateComponent id={67}>{tab === '67' && <CustomGroup></CustomGroup>}</PrivateComponent>
        </div>
      )}
    </PageTab>
  );
}
