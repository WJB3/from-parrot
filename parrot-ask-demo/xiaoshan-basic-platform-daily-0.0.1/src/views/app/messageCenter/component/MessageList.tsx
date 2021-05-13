import React, { useEffect, useState } from "react";
import { Table, Form, Input, Row, Button, Space, Modal, message, TreeSelect, Select } from 'antd';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable, useEventEmitter } from 'ahooks';

import GT from 'types';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import api from 'src/api';
import constant from 'src/constant';
import OneLineText from 'src/components/OneLineText';
import useMoment from "src/hook/useMoment";
import IconFont from "src/components/IconFont";
import { useHistory } from "react-router-dom";
import useSocket from "src/hook/useSocket";
import { useGlobalState } from "src/store";

export default function MessageList(props: {unreadCount: number}) {
    const [form] = Form.useForm<GT.DTO.SearchMessageDto>();
    const [rows, setRows] = useState<GT.Model.Message[]>([]);
    const { datetime_m } = useMoment();

    // 操作了删除、查看，影响角标
    const [state, dispatch] = useGlobalState();
    const refreshCount = () => {
      state.socketHandlers.forEach((e) => {
        if (e.type == 4 || e.type == 3) {
          e.handler("")
        }
      });
    };

    // 订阅手打通知，页面刷新
    const { listen } = useSocket();
    useEffect(()=> {
      return listen({type: 1, handler: () => {
        reset();
      }});
    }, []);

    const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) =>
      api.message.getPage({
        ...formData,
        current,
        size,
      });
  
    const { tableProps, search, refresh } = useAntdTable(getTableData, {
      form: form,
    });
    const { submit, reset } = search;
    const history = useHistory();
    const onShow = (record: GT.Model.Message) => {
        if (!record.readState) {
          onRead([record], false, false);
        }
        
        if (record.url) {
          if (record.url === "/app/362") {
            const ext = JSON.parse(record.extra);
            if (ext.relatedId) {
              history.push(`/app/362/366/LeaveDetail/${ext.relatedId}`);
            }
          } else if(record.url === "/app/427") {
            const ext = JSON.parse(record.extra);
            if (ext.taskId) {
              api.assessment.getMyDetail(ext.taskId).then((e) => {
                history.push(`/app/427/428/ResultDetail/${ext.taskId}`);
              });
            }
          } else {
            if (record.sourceType === 3 && record.url === "/app/204") {
              // 跳转到成果申报详情页面
              if (record.extra == undefined) {
                // 没有定义
                history.push(record.url!);
                return
              }
              const ext = JSON.parse(record.extra);
              if (ext.taskId) {
                // 跳转对应的成果详情
                api.task.getMyDeclareDetail(ext.taskId).then((res) => {
                  // history.push(`${record.url!}?id=${ext.taskId}`);
                  history.push(record.url!);

                  // history.push(`${record.url!}`, {id: ext});

                })
              }  else {
                history.push(record.url!);
              }
            } else {
              history.push(record.url!);
            }
          }
        }
    };
    const onDelete = (records: GT.Model.Message[]) => {
      Modal.confirm({
        title: '删除消息吗？',
        onOk: () => {
          api.message.delete({ data: records.map((record) => record.id) }).then(() => {
            message.success('删除成功');
            refreshCount();
            setRows([]);
            submit();
          });
        },
      });
    };
    const onRead = (records?: GT.Model.Message[], all?: boolean, hud: boolean = true) => {
        api.message.read({all: all, ids: records?.map((record) => record.id)}).then( () => {
            refreshCount();
            if (hud) {
              message.success('已读成功');
              setRows([]);
              submit();
            }
        });
    };
    const columns: ColumnType<GT.Model.Message>[] = [
      {
        title: '状态',
        dataIndex: 'readState',
        align: 'center',
        render: (value) => <IconFont type={value ? 'iconcaiji-yidu' : 'iconcaiji-weidu'}></IconFont>,
        width: 60,
      },
      {
        title: '消息类型',
        dataIndex: 'type',
        align: 'center',
        render: (value) => constant.messageType.type.get(value),
      },
      {
        title: '消息标题',
        dataIndex: 'title',
        align: 'center',
        // render: (value) => <OneLineText>{value}</OneLineText>,
      },
      {
        title: '消息内容',
        dataIndex: 'content',
        align: 'center',
        render: (value) => <OneLineText maxWidth={"100%"}>{value}</OneLineText>,
      },
      {
        title: '发起人/应用',
        dataIndex: 'sourceName',
        align: 'center',
        render: (text, record) => ( record.sourceType == 1 ? "系统": <span>【{record.sourceName}】</span>),
      },
      {
        title: '消息时间',
        dataIndex: 'createdTime',
        align: 'center',
        render: (value) => datetime_m(value),
      },
      {
        title: '操作',
        fixed: 'right',
        align: 'center',
        width: 250,
        render: (text, record) => (
          <Space>
              <Button type='link' disabled={record.type == 1} onClick={() => onShow(record)}>
                查看
              </Button>
              <Button type='link' danger onClick={() => onDelete([record])}>
                删除
              </Button>
          </Space>
        ),
      },
    ];
    tableProps.pagination = {
      ...tableProps.pagination,
      ...constant.pagination,
    };

    const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.Message[]) => {
      setRows(selectedRows);
    };

    return (
      <div>
        <Form form={form} className='search_form'>
          <Row>
            <Row className='search_form_items'>
              <Form.Item label='消息标题' name='title'>
                <Input placeholder='请输入' />
              </Form.Item>
  
              <Form.Item label='消息类型' name='type'>
                <Select placeholder='请选择'>
                    {[...constant.messageType.type.entries()].map(([value, label]) => (
                    <Select.Option value={value} key={value}>
                        {label}
                    </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Row>
            <Form.Item>
              <Space>
                <Button type='primary' onClick={submit}>
                  查询
                </Button>
                <Button onClick={reset}>重置</Button>
              </Space>
            </Form.Item>
          </Row>
        </Form>
          <p style={{marginBottom: 23, marginTop: 5}}>
            <Space>
                <Button type='primary' ghost disabled={!rows.length} onClick={ () => onRead(rows, false)}>
                  批量已读
                </Button>
                <Button type='primary' ghost disabled={props.unreadCount == 0} onClick={ () => onRead(undefined, true)}>
                 全部标为已读
                </Button>
                <Button type='primary' ghost disabled={!rows.length} onClick={() => onDelete(rows)}>
                  批量删除
                </Button>
            </Space>
          </p>
        <Table
          style={appStyle.table}
          columns={columns}
          rowKey='id'
          {...tableProps}
          rowSelection={{
            type: 'checkbox',
            onChange,
            fixed: true,
            selectedRowKeys: rows.map((item) => item.id),
          }}
          size='middle'
          scroll={{ scrollToFirstRowOnChange: true, x: 1400 }}
        />
      </div>
    );
}