import React, { useEffect, useState,useRef } from 'react';
import { Table, Form, Input, Row, Button, Space, Modal, message, Spin } from 'antd';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable, useRequest } from 'ahooks';

import GT from 'types';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import api from 'src/api';
import constant from 'src/constant';
import { RouteComponentProps } from 'react-router-dom';
import { ActionType, useGlobalState } from 'src/store';
import ImportExcelModal from "src/components/importModal";

export default function RecordDetail(props: RouteComponentProps<{id: string, taskId: string, taskName: string}>) {
  const taskId = props.match.params.taskId;
  const itemId: number = Number(props.match.params.id);

  const [loading, setLoading] = useState(true);
  const [itemDetail, setItemDetail] = useState<GT.Model.MentTaskResultItem>();

  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{zhName:"提交详情"},{ zhName: props.match.params.taskName }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    }
  }, []);

  const refreshData = () => {
    api.assessment.getItemDetail(Number(taskId), itemId as number).then((res) => {
      setItemDetail(res);
    });
    submit();
  };
  
  // 获取动态表头信息
  const {data} = useRequest(() => api.assessment.getItemDetail(Number(taskId), itemId as number).then((res) => {
    setItemDetail(res);
    updateTableHead(res.subItems);
    setLoading(false);
    setTimeout(() => {
      submit();
    }, 250);
    return res;
  }).catch((e) => {setLoading(false);}));

  // 更新表头
  const updateTableHead = (subItems: GT.Model.MentTaskResultSubItem[]) => {
    // 分组
    const groupBy = (array: GT.Model.MentTaskResultSubItem[], f: Function) => {
      const groups: {[key: string]: GT.Model.MentTaskResultSubItem[]} = {};
      array.forEach((item) => {
        const group = f(item);
        groups[group] = groups[group] || [];
        groups[group].push(item);
      });
      return Object.keys(groups).map((group) => {
        return groups[group];
      });
    };
    const list = groupBy(subItems, (item: GT.Model.MentTaskResultSubItem) => {
      return item.semesterOrder;
    });

    // 存在数据
    let newsLists = columns;
    if (list.length == 1) {
      newsLists = updateOne(subItems, newsLists);
    } else if(list.length == 2) {
      newsLists = updateTwo(list, newsLists);
    } else if (list.length == 3) {
      newsLists = updateTwo(list.slice(0, 2), newsLists);
      list[2].forEach((item, index) => {
        const col = {
          title: item.name,
          dataIndex: item.itemId,
          align: 'center',
          render: (value: any, model: GT.Model.MentTaskResult) => {
            if (model.items == undefined || model.items.length <= 0) {
              return "";
            }
  
            const model2 = model.items[0].subItems[index];
            return model2.actualScore != undefined ? (model2.plusMinus ? model2.actualScore : -model2.actualScore) : "";
          },
        };
        newsLists.push(col as any);
      });
    }

    const total = {
      title: '总分',
      dataIndex: 'resultScore',
      align: 'center',
    }
    newsLists.push(total as any)
    console.log(newsLists);
    setColumnsState([...newsLists]);
  };

  const updateOne = (subItems: GT.Model.MentTaskResultSubItem[], column: ColumnType<GT.Model.MentTaskResult>[]) => {
    subItems.forEach((item, index) => {
      const col = {
        title: item.name,
        dataIndex: item.itemId,
        align: 'center',
        render: (value: any, model: GT.Model.MentTaskResult) => {
          if (model.items == undefined || model.items.length <= 0) {
            return "";
          }

          const model2 = model.items[0].subItems[index];
          return model2.actualScore != undefined ? (model2.plusMinus ? model2.actualScore : -model2.actualScore) : "";
        }
      };
      column.push(col as any);
    });
    return column;
  };

  const updateTwo = (list: GT.Model.MentTaskResultSubItem[][], column: ColumnType<GT.Model.MentTaskResult>[]) => {
    list.forEach((items, i) => {
      items.push({itemId: itemId, name: "小计", plusMinus: true, actualScore: 0, semesterOrder: 0, score: 0})
        const col = {
          title: i == 0 ? "第一学期" : "第二学期",
          children: 
            items.map((item, j) => {
              return {
                title: item.name, 
                dataIndex: item.itemId, 
                align: 'center',
                render: (value: any, model: GT.Model.MentTaskResult) => {
                  if (model.items == undefined || model.items.length <= 0) {
                    return "";
                  }
                  const result = model.items[0];
                  if (j == items.length - 1) {
                    // 小计
                    if (result.subItemActualScores == undefined) {
                      return ""
                    }
                    return result.subItemActualScores[i];
                  }
                  if (result.subItems == undefined) {
                    return ""
                  }
                  const model2 = result.subItems[(i == 0 ? j : (i * (items.length - 1) + j))];
                  return model2.actualScore != undefined ? (model2.plusMinus ? model2.actualScore : -model2.actualScore) : "";
                },
              }
            }),
        };
        column.push(col as any);
    });
    return column;
  };

  const [form] = Form.useForm<GT.DTO.SearchAssessmentItemResultParams>();

  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    if (data == undefined) {
      return Promise.resolve();
    }
    return api.assessment.itemResult(itemId, {...formData, current, size, taskId });
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const { submit, reset } = search;

  const columns: ColumnType<GT.Model.MentTaskResult>[] = [
    {
      title: '序号',
      dataIndex: 'orderNumber',
      align: 'center',
    },
    {
      title: '教师姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      align: 'center',
    },
  ];

  const importModal = useRef<GT.Modal.Ref>();

  function submitFun() {
   // if (itemDetail?.progressState === 1) {
      importModal.current?.setItemId(itemId);
      importModal.current?.setTaskId(taskId);
      importModal.current?.setTitle(`提交考核-${props.match.params.taskName}`);
      importModal.current?.setVisible(true);
    // } else {
    //   message.error("状态不对");
    //}
  }

  const [columnsState, setColumnsState] = useState(columns);

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  function getScoreText(item: GT.Model.MentTaskResultItem | undefined): string {
    if (item == undefined) {
      return ""
    }
    if (item.type === 1) {
      if (!item.limited) {
        return `共${item.totalScore}分，由${item.assessmentOrg}考核`;
      } else {
        return `最多不超过${item.totalScore}分，由${item.assessmentOrg}考核`;
      }
    } else if (item.type === 2) {
      return `±${item.totalScore}分`;
    } else {
      return "";
    }
  }

  return loading ?
  (<Row justify="center">
    <Spin
      style={{ marginTop: "30vh" }}
      spinning={loading}
      size="large"
    ></Spin>
  </Row>
  ) : (
    <div>
      <div>
        <p style={{fontSize: 20, color: '#303133', fontWeight:'bold', marginBottom: 6}}>{itemDetail?.taskName}——{itemDetail?.name}</p>
        <p style={{fontSize: 13}}>
          <span style={{color: '#303133'}}>{getScoreText(itemDetail)}</span>
          <span style={{color: '#909499', marginLeft: 17}}>{itemDetail?.updatedBy} 于 {itemDetail?.updatedTime} 最新更新</span>
        </p>
      </div>
      <Form form={form} className='search_form'>
        <Row>
          <Row className='search_form_items'>

            <Form.Item label='教师姓名' name='name'>
              <Input placeholder='请输入' />
            </Form.Item>

            <Form.Item label='手机号' name='phone'>
              <Input placeholder='请输入' />
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

      <p>
        <Space>
            <Button type='primary' ghost onClick={submitFun}>
              更新考核分数
            </Button>
        </Space>
      </p>

      <Table
        style={appStyle.table}
        columns={columnsState}
        rowKey='id'
        bordered
        {...tableProps}
        size='middle'
        scroll={{ x:  (itemId == 1 || itemId == 7 ? 1000 :'calc(800px + 50%)') }}
      />
       <ImportExcelModal
        type="assessment"
        onRef={(ref) => (importModal.current = ref)}
        onOk={refreshData}
      />
    </div>
  );
}
