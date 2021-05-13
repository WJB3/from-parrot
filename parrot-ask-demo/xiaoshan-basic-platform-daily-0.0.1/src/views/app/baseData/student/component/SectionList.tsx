import { useRequest } from 'ahooks';
import { Button, Card, Col, message, Modal, Row, Space, Table } from 'antd';
import { LabeledValue } from 'antd/lib/select';
import { ColumnType } from 'antd/lib/table';
import React, { useRef, useState } from 'react';
import api from 'src/api';
import PrivateComponent from 'src/components/PrivateComponent';
import GT from 'types';
import SectionChart from './charts/SectionChart';
import CreatePreSectionModal from './CreatePreSection';
import CreateSectionModal from './CreateSection';
export default function SectionList(props: { onRefresh?: () => void }) {
  const createModal = useRef<GT.Modal.Ref>();
  const preModal = useRef<GT.Modal.Ref>();
  const { loading, data, refresh } = useRequest(api.section.getAllStatistics, {
    onSuccess(res) {
      const student: LabeledValue[] = [],
        classes: LabeledValue[] = [],
        parent: LabeledValue[] = [];
      res.forEach((item) => {
        student.push({ label: item.sectionName, value: item.studentCount });
        classes.push({ label: item.sectionName, value: item.classCount });
        parent.push({ label: item.sectionName, value: item.parentCount });
      });
      setChartData({
        student,
        classes,
        parent,
      });
    },
  });
  const [charData, setChartData] = useState({
    student: [] as LabeledValue[],
    classes: [] as LabeledValue[],
    parent: [] as LabeledValue[],
  });
  const columns: ColumnType<GT.Model.SectionStatistic>[] = [
    {
      title: '学段名称',
      dataIndex: 'sectionName',
      align: 'center',
    },
    {
      title: '年级数量',
      dataIndex: 'gradeCount',
      align: 'center',
    },
    {
      title: '班级数量',
      dataIndex: 'classCount',
      align: 'center',
    },
    {
      title: '学生数量',
      dataIndex: 'studentCount',
      align: 'center',
    },
    {
      title: '登记家长数量',
      dataIndex: 'parentCount',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <PrivateComponent id={179}>
          <Button type='link' danger onClick={() => onDelete(record)}>
            关闭学段
          </Button>
        </PrivateComponent>
      ),
    },
  ];
  const onCreate = () => {
    createModal.current?.setVisible(true);
  };
  const onPreCreate = () => {
    preModal.current?.setVisible(true);
  };
  const onDelete = (record: GT.Model.SectionStatistic) => {
    if (record.sectionType === 3) {
      return Modal.confirm({
        title: '关闭后，预备生数据将删除，请确认新生数据已导入基础平台后再删除，是否确认删除操作？',
        onOk: () => {
          api.section.delete({ data: [record.sectionId] }).then(() => {
            message.success('删除成功');
            refresh();
            props.onRefresh?.();
          });
        },
      });
    }
    if (record.studentCount) {
      return Modal.info({
        title: '学段学生数量不为0，请先删除当前学段全部学生，再关闭当前学段。',
      });
    }
    Modal.confirm({
      title: '关闭后，当前学段相关年级、班级和学生将隐藏，无法查看和查询，确认关闭当前学段吗？',
      onOk: () => {
        api.section.delete({ data: [record.sectionId] }).then(() => {
          message.success('删除成功');
          refresh();
          props.onRefresh?.();
        });
      },
    });
  };
  return (
    <div>
      <p>
        <Row gutter={20}>
          <Col span={8}>
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 10 }}>
              <SectionChart title='学生数量' dataSource={charData.student}></SectionChart>
            </Card>
          </Col>
          <Col span={8}>
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 10 }}>
              <SectionChart title='班级数量' dataSource={charData.classes}></SectionChart>
            </Card>
          </Col>
          <Col span={8}>
            <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 10 }}>
              <SectionChart title='家长数量' dataSource={charData.parent}></SectionChart>
            </Card>
          </Col>
        </Row>
      </p>
      <PrivateComponent id={[40, 41]}>
        <p>
          <Space>
            <PrivateComponent id={40}>
              <Button ghost type='primary' onClick={onCreate}>
                新增学段
              </Button>
            </PrivateComponent>
            <PrivateComponent id={41}>
              <Button ghost type='primary' onClick={onPreCreate}>
                预备班设置
              </Button>
            </PrivateComponent>
          </Space>
        </p>
      </PrivateComponent>

      <Table loading={loading} pagination={false} columns={columns} dataSource={data}></Table>
      <CreateSectionModal
        onRef={(ref) => (createModal.current = ref)}
        onOk={() => {
          refresh();
          props.onRefresh?.();
        }}></CreateSectionModal>
      <CreatePreSectionModal
        onRef={(ref) => (preModal.current = ref)}
        onOk={() => {
          refresh();
          props.onRefresh?.();
        }}></CreatePreSectionModal>
    </div>
  );
}
