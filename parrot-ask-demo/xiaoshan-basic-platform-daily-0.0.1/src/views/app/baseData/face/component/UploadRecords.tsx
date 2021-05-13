import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, Button, Space, Timeline, Empty } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import UploadFiles from 'src/components/UploadFiles';
import { useRequest } from 'ahooks';
import useDownload from 'src/hook/useDownload';

export default function UploadRecordsModal(
  props: GT.Modal.Props & { type: 'teacher' | 'student' | 'prestudent' | 'service'},
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('导入记录');
  const [form] = Form.useForm<any>();
  const { download } = useDownload();
  let getData: (params: {
    current: number;
    size: number;
  }) => Promise<GT.Response.Page<GT.Model.ImportFaceRecord>>;
  switch (props.type) {
    case 'teacher':
      getData = api.teacher.getImportRecordPage;
      break;
    case 'student':
      getData = ({ current, size }) =>
        api.student.getImportRecordPage({
          type: 1,
          current,
          size,
        });
      break;
    case 'prestudent':
      getData = ({ current, size }) =>
        api.student.getImportRecordPage({
          type: 2,
          current,
          size,
        });
      break;
    case 'service':
      getData = ( {current, size} ) => 
       api.service.getImportRecordPage( {current, size});
  }
  const { loading, pagination, run, data } = useRequest(
    ({ current, pageSize: size }) => getData({ current, size }),
    {
      manual: true,
      paginated: true,
    },
  );
  props.onRef({
    setVisible,
    setTitle,
    form: form,
  });
  useEffect(() => {
    if (visible) {
      run({ current: 1, pageSize: 10 });
    }
  }, [visible]);
  const handleCancel = () => {
    setVisible(false);
  };

  const normFile = (e: any) => {
    return e;
  };
  const footerVisible =
    pagination.total > pagination.current * pagination.pageSize || pagination.current > 1;
  return (
    <Modal
      title={title}
      visible={visible}
      footer={
        footerVisible && (
          <Space>
            {pagination.current > 1 && (
              <Button
                type='link'
                ghost
                onClick={() => {
                  run({ current: pagination.current - 1, pageSize: pagination.pageSize });
                }}>
                上一页
              </Button>
            )}
            {pagination.total > pagination.current * pagination.pageSize && (
              <Button
                type='link'
                ghost
                onClick={() => {
                  run({ current: pagination.current + 1, pageSize: pagination.pageSize });
                }}>
                下一页
              </Button>
            )}
          </Space>
        )
      }
      onCancel={handleCancel}
      afterClose={handleCancel}
      confirmLoading={loading}>
      <Timeline>
        {data?.list?.map((item) => {
          let content;
          if (!item.date) {
            content = '照片正在导入系统并同步到设备，期间需花费20~60分钟......';
          } else if (!item.date && item.failed === 0) {
            content = '所有数据下发成功';
          } else {
            content = (
              <div>
                <p>
                  共有{item.success}条数据下发成功，{item.failed}条数据下发失败。
                </p>
                <Button
                  style={{ padding: 0 }}
                  type='link'
                  onClick={() => download({ fileName: item.fileName, url: item.url })}>
                  下载失败名单
                </Button>
              </div>
            );
          }

          return (
            <Timeline.Item>
              <p style={{ fontSize: 13, color: '#909499' }}>{item.date || item.createDate}</p>
              <div
                style={{
                  padding: 10,
                  borderRadius: 3,
                  background: '#F2F4F7',
                  color: '#616266',
                  fontSize: 13,
                }}>
                {content}
              </div>
            </Timeline.Item>
          );
        })}
      </Timeline>
      {!loading && !data?.total && <Empty />}
    </Modal>
  );
}

UploadRecordsModal.defaultProps = {
  type: 'teacher',
};
