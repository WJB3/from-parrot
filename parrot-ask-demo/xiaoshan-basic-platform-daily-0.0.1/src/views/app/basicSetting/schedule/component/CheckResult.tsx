import React, { useState } from 'react';
import { Modal, Form, message, DatePicker, Button, Row, Table, Alert } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import UploadFiles from 'src/components/UploadFiles';
import { PlusOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/lib/table';

export default function ScheduleCheckResultModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('全校校验');
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<GT.Model.ScheduleCheckResult>();
  props.onRef({
    setVisible,
    setTitle,
    setData,
  });
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
  };
  const columns: ColumnType<GT.Model.ScheduleRange>[] = [
    {
      title: '学段',
      align: 'center',
      dataIndex: 'sectionName',
      render: (val, record, index) => {
        const dataSource = data?.sections || [];
        const isEmpty = dataSource.filter((item) => item.sectionName === val && !item.restName)
          .length;
        return {
          children: isEmpty ? <span style={{ color: '#FE4F54' }}>{val}</span> : val,
          props: {
            style: {
              padding: '10px 0',
            },
            rowSpan:
              dataSource[index - 1]?.sectionName === val
                ? 0
                : dataSource.filter((item) => item.sectionName === val).length,
          },
        };
      },
    },
    {
      title: '年级',
      align: 'center',
      dataIndex: 'gradeName',
      render: (val, record) => {
        return record.restName ? val : <span style={{ color: '#FE4F54' }}>{val}</span>;
      },
    },
    {
      title: '作息时间',
      align: 'center',
      dataIndex: 'restName',
      render: (val) => {
        return val || <span style={{ color: '#FE4F54' }}>未设置</span>;
      },
    },
  ];
  return (
    <Modal
      title={title}
      visible={visible}
      footer={
        <Row justify='center'>
          <Button type='primary' onClick={handleCancel}>
            我知道了
          </Button>
        </Row>
      }
      onCancel={handleCancel}
      afterClose={handleCancel}>
      <div>
        <p>
          {data?.checkResult === 1 ? (
            <Alert
              type='error'
              showIcon={false}
              message={
                <span style={{ color: '#FE4F54' }}>
                  作息时间设置存在遗漏情况，请核对后重新设置！
                </span>
              }
              style={{ borderRadius: 3 }}
              banner
            />
          ) : (
            <Alert
              type='success'
              showIcon={false}
              message={<span style={{ color: '#3CC251' }}>所有年级都已设置作息时间！</span>}
              style={{ borderRadius: 3 }}
              banner
            />
          )}
        </p>

        <Table
          className='table_no_hover'
          columns={columns}
          bordered
          dataSource={data?.sections || []}
          pagination={false}></Table>
      </div>
    </Modal>
  );
}
