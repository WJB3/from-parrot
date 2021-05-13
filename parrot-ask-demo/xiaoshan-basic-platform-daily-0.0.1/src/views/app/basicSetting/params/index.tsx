import React, { useRef } from 'react';
import { Table, Form, Input, Row, Col, Button, Select, Space, message, Popconfirm } from 'antd';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable } from 'ahooks';

import { Store } from 'antd/lib/form/interface';
import GT from 'types';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import api from 'src/api';
import constant from 'src/constant';
import { useHistory } from 'react-router-dom';
import CreateDictionaryModal from './component/CreateDictionary';
import DictionarySidebar from 'src/components/DictionarySidebar';
import PlatformDictionaryPage from './Dictionary';

export default function PlatformParamsPage(props: any) {
  return (
    <div>
      <DictionarySidebar>
        {({ node, refresh }) => {
          let defaultStatus: 0 | 1 | undefined = undefined;
          if (node?.id === -2) {
            defaultStatus = 0;
          } else if (node?.id === -1) {
            defaultStatus = 1;
          } else {
            defaultStatus = node?.defaultStatus;
          }

          return (
            <PlatformDictionaryPage
              dicCode={node?.dicCode}
              node={node}
              onRefresh={refresh}
              defaultStatus={defaultStatus}></PlatformDictionaryPage>
          );
        }}
      </DictionarySidebar>
    </div>
  );
}
