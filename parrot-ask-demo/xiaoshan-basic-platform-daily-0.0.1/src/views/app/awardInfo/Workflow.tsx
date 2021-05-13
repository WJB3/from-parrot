import { useRequest } from 'ahooks';
import { Form, Row, Space, Switch, Table } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import api from 'src/api';
import constant from 'src/constant';
// 0 单人 1或签 2会签
export default function WorkFlowPage(
  props: RouteComponentProps<{
    id: string;
  }>,
) {
  const { data } = useRequest(() => api.base.getWorkflow(props.match.params.id));

  return (
    <Row justify='center'>
      <Form {...constant.form.layout} style={{ width: 500 }}>
        <p style={{ fontSize: 20, textAlign: 'center' }}>
          <b>审批设置</b>
        </p>
        <Form.Item label='是否开启'>
          <Space>
            <Switch checked={data?.openState}></Switch>
            <span>{data?.openState ? '已开启' : '已关闭'}</span>
          </Space>
        </Form.Item>
        <Form.Item label='审批流程'>
          <Table
            bordered
            dataSource={data?.nodes || []}
            pagination={false}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <div style={{ textAlign: 'center' }}> 抄送</div>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <div style={{ textAlign: 'center' }}>
                    {data?.carbonCopies.map((item: any) => item.targetName).join(',')}
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <div style={{ textAlign: 'center' }}> - -</div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
            columns={[
              {
                dataIndex: 'orderNumber',
                align: 'center',
                title: '审批节点',
              },
              {
                dataIndex: 'approvers',
                align: 'center',
                title: '审批人',
                render: (approvers) => {
                  return approvers.map((item: any) => item.approverName).join(',');
                },
              },
              {
                dataIndex: 'signType',
                align: 'center',
                title: '审批方式',
                render: (val?: 0 | 1 | 2) => {
                  if (val === undefined) {
                    return '- -';
                  }
                  const map = {
                    0: '单人',
                    1: '或签',
                    2: '会签',
                  };
                  return map[val];
                },
              },
            ]}></Table>
        </Form.Item>
      </Form>
    </Row>
  );
}
