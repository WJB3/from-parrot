import { useRequest } from 'ahooks';
import { Card, Col, Row, Table } from 'antd';
import { LabeledValue } from 'antd/lib/select';
import { ColumnType } from 'antd/lib/table';
import React, { useState } from 'react';
import api from 'src/api';
import GT from 'types';
import SectionChart from './charts/SectionChart';
export default function SectionDetail(props: { node: any }) {
  const { data, loading } = useRequest(() => api.section.getStatistics(props.node.sectionId), {
    refreshDeps: [props.node],
    onSuccess(res) {
      const student: LabeledValue[] = [],
        classes: LabeledValue[] = [],
        parent: LabeledValue[] = [];
      res.forEach((item) => {
        student.push({ label: item.gradeName, value: item.studentCount });
        classes.push({ label: item.gradeName, value: item.classCount });
        parent.push({ label: item.gradeName, value: item.parentCount });
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
      title: '入学年份',
      dataIndex: 'enrollmentYear',
      align: 'center',
    },
    {
      title: '年级',
      dataIndex: 'gradeName',
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
  ];
  return (
    <div>
      <p>
        <b>学段情况</b>
      </p>
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
      <Table loading={loading} pagination={false} columns={columns} dataSource={data}></Table>
    </div>
  );
}
