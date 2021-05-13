import { useRequest } from 'ahooks';
import { Button, Row, Space, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import Column from 'antd/lib/table/Column';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import api from 'src/api';
import useDictionary from 'src/hook/useDictionary';
import useDownload from 'src/hook/useDownload';
import html2canvas from 'html2canvas';
import GT from 'types';

import { UploadOutlined, PrinterOutlined } from '@ant-design/icons';
import useCalendar from 'src/hook/useCalendar';
export default function CheckSchedulePage(props: RouteComponentProps<{ id: any }>) {
  const { data } = useRequest(() => api.schedule.get(props.match.params.id));
  const { renderText } = useDictionary();
  const { downloadBase64 } = useDownload();
  const { createPdf } = useCalendar();
  const downLoadPdf = () => {
    const dom = document.querySelector('#pdf') as HTMLElement;
    if (dom) {
      html2canvas(dom).then((canvas) => {
        let dataURL = canvas.toDataURL('image/jpeg', 1.0);
        downloadBase64({
          dataURL,
          fileName: data?.restName || '',
        });
      });
    }
  };
  const onPreview = () => {
    createPdf('#pdf', false);
  };
  const columns: ColumnType<GT.DTO.ScheduleDetail>[] = [
    {
      title: '时段',
      align: 'center',
      dataIndex: 'timeRange',
      render: (val: 0 | 1 | 2, record, index) => {
        const dataSource: any[] = data?.details || [];
        const map = {
          0: '上午',
          1: '下午',
          2: '晚上',
        };
        return {
          children: map[val],
          props: {
            style: {
              padding: '10px 0',
            },
            rowSpan:
              dataSource[index - 1]?.timeRange === val
                ? 0
                : dataSource.filter((item) => item.timeRange === val).length,
          },
        };
      },
    },
    {
      title: '节次名称',
      align: 'center',
      dataIndex: 'sectionName',
    },
    {
      title: '开始时间',
      align: 'center',
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      align: 'center',
      dataIndex: 'endTime',
    },
    {
      title: '节次类型',
      align: 'center',
      dataIndex: 'type',
      render: (val) => renderText('restSectionType', val),
    },
  ];
  return (
    <div
      style={{
        width: 1000,
        padding: 10,
        margin: '0 auto',
        position: 'relative',
        zIndex: 111,
        background: '#fff',
      }}>
      <p>
        <Row justify='end'>
          <Space>
            <Button type='primary' ghost onClick={downLoadPdf} icon={<UploadOutlined />}>
              下载
            </Button>
            <Button type='primary' ghost onClick={onPreview} icon={<PrinterOutlined />}>
              打印
            </Button>
          </Space>
        </Row>
      </p>
      <div id='pdf'>
        <p style={{ textAlign: 'center', fontSize: 28, marginBottom: 10 }}>
          <b>{data?.restViewName}</b>
        </p>
        <p style={{ textAlign: 'center', fontSize: 14 }}>【{data?.gradeName}】</p>
        <Table
          className='table_no_hover print_table'
          bordered
          columns={columns}
          dataSource={data?.details || []}
          pagination={false}></Table>
        <p style={{ marginTop: 10, wordBreak: 'break-all' }}>{data?.remark}</p>
      </div>
    </div>
  );
}
