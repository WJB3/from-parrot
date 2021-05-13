import { Button, Form, Row } from 'antd';
import React, { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';

import UploadFiles from 'src/components/UploadFiles';
import EditLogoModal from './component/EditLogo';
import GT from 'types';
import { useRequest } from 'ahooks';
import api from 'src/api';
import PrivateComponent from 'src/components/PrivateComponent';
export default function SchoolLogoPage() {
  const modal = useRef<GT.Modal.Ref>();
  const { data, refresh } = useRequest(api.base.getBaseInfo);
  return (
    <Form>
      <Form.Item label='学校名称'>{data?.schoolName}</Form.Item>
      <Form.Item label='logo' help='logo将用于APP和电子班牌内展示。'>
        <Row align='bottom'>
          <div style={{ width: 100 }}>
            <Form.Item noStyle>
              <UploadFiles
                upload={{ disabled: true }}
                limit={1}
                fileList={
                  data?.logoUrl
                    ? ([
                        {
                          uid: '1',
                          url: data.logoUrl,
                        },
                      ] as any)
                    : []
                }>
                <div style={{ color: '#84878C' }}>
                  <PlusOutlined />
                  <div>上传图片</div>
                </div>
              </UploadFiles>
            </Form.Item>
          </div>
          <PrivateComponent id={277}>
            <Button
              type='link'
              style={{ marginBottom: 10 }}
              onClick={() => modal.current?.setVisible(true)}>
              修改
            </Button>
          </PrivateComponent>
        </Row>
      </Form.Item>
      <EditLogoModal onRef={(ref) => (modal.current = ref)} onOk={refresh}></EditLogoModal>
    </Form>
  );
}
