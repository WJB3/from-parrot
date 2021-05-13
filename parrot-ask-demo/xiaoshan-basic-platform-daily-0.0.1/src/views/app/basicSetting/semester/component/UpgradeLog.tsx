import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, Button, Space, Timeline, Empty } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import UploadFiles from 'src/components/UploadFiles';
import { useRequest } from 'ahooks';
import useDownload from 'src/hook/useDownload';
import { textSpanContainsPosition } from 'typescript';

export default function UpgradeLogModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('操作记录');
  const [form] = Form.useForm<any>();
  const { download } = useDownload();
  const { loading, pagination, run, data } = useRequest(
    ({ current, pageSize: size }) => api.semester.getLogPage({ params: { current, size } }),
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
  const renderStatus = (state: -1 | 0 | 1) => {
    let color, text;
    switch (state) {
      case -1:
        color = '#FE4F54';
        text = '同步失败';
        break;
      case 0:
        color = '#5781F2';
        text = '同步中';
        break;
      case 1:
        color = '#3CC251';
        text = '同步成功';
        break;
      default:
        break;
    }
    return <span style={{ color }}>{text}</span>;
  };
  const renderText = (log: GT.Model.SemesterLog) => {
    let text = '';
    switch (log.state) {
      case -1:
        text = '开启失败，学生组织架构同步失败。';
        break;
      case 0:
        text = '已开启，学生组织架构正在同步到硬件设备平台，期间需花费1〜2小时……';
        break;
      case 1:
        text = '已开启，学生组织架构已同步成功。';
        break;
      default:
        break;
    }
    return (
      <p style={{ fontSize: 13, color: '#616266' }}>
        <span style={{ color: '#303133' }}>
          【{log.startYear}-{log.endYear} {constant.semester.orderNo.get(log.state)}】
        </span>
        {text}
      </p>
    );
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
          return (
            <Timeline.Item>
              <p style={{ fontSize: 13, color: '#909499' }}>
                {item.createdTime} {renderStatus(item.state)}
              </p>
              <div
                style={{
                  padding: 10,
                  borderRadius: 3,
                  background: '#F2F4F7',
                  color: '#616266',
                  fontSize: 13,
                }}>
                {renderText(item)}
                {item.state === -1 && (
                  <Button
                    type='primary'
                    onClick={() => {
                      api.semester.retry();
                      setVisible(false);
                      message.info('同步中');
                    }}>
                    继续同步
                  </Button>
                )}
              </div>
            </Timeline.Item>
          );
        })}
      </Timeline>
      {!loading && !data?.total && <Empty />}
    </Modal>
  );
}
