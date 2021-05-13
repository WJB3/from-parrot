import React, { useState, useEffect } from 'react'
import { Table, Form, Input, Row, Button, Space, Col, Modal, message, Spin } from 'antd';
import PrivateComponent from 'src/components/PrivateComponent';
import useDictionary from 'src/hook/useDictionary';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useRequest } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import appStyle from 'src/App.style';
import constant from 'src/constant';
import api from 'src/api';
import GT, { Model } from 'types';
import { RouteComponentProps } from 'react-router-dom';
import useDownload from 'src/hook/useDownload';
import OneLineText from 'src/components/OneLineText';
import { useGlobalState, ActionType } from "src/store";

export default function AssessResult(props: RouteComponentProps<{ id: any, name: any }>) {
  const [form] = Form.useForm();
  const { download } = useDownload();
  const [, dispatch] = useGlobalState();
  // 是否已经发布
  const [isPublished, setIsPublished] = useState(false);
  const [isNeedRefresh, setIsNeedRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadFlaging, setLoadFlaging] = useState(true);

  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: "考评结果" }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);

  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    return api.assessment.getAssessResultList({
      ...formData,
      taskId: props.match.params.id,
      current,
      size,
    });
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
    formatResult: (res) => {
      let lists = res.list
      lists.forEach((model) => {
        if (model.items&&model.items.length > 0) {
          model.items.forEach((item) => {
            const id = item.id
            // const score = (item.totalActualScore === undefined) ? 0 : item.totalActualScore
            model[id] = item.totalActualScore
          })
        }
        // if (model.resultScore === undefined) {
        //   model["resultScore"] = 0
        // }
      })
      return {list: lists, total: res.total}
    },
  });

  const { submit, reset } = search;

  // 获取对应的Column的展示方案
  const { data } = useRequest(() =>    
    api.assessment.getTaskDetail(props.match.params.id),{
      onSuccess: (res) => {
        updateColumnData(res);
        res.published&&setIsPublished(res.published);
        setLoadFlaging(false);
      },
      onError: (e) => {
        setLoadFlaging(false);
      },
      refreshDeps: [isNeedRefresh],
    },
  );

  // 发布结果
  const submitResult = () => {
    const content = isPublished ? "发布之后将覆盖上次发布结果，确定要更新发布吗？" : "发布之后，教师即可通过“我的考评”查看考评结果，确定要立即发布吗？"
    Modal.confirm({
      title: '提示',
      content: content,
      onOk: () => {
        setLoading(true);
        api.assessment.updateAccessResults(props.match.params.id).then((res) => {
          // 更新数据
          // 重新请求详情
          setLoading(false);
          const successMessage = isPublished ? "更新发布成功" : "发布成功";
          message.success(successMessage);
          setIsNeedRefresh(isNeedRefresh + 1);
          reset();
        })
        .catch(()=> {
          setLoading(false);
        });
      },
    }); 
  }

  // table 头部的列表
  const fixedColumns: ColumnsType<GT.Model.MentTaskResult> = [
    {
      title: '序号',
      dataIndex: 'orderNumber',
      fixed: true,
      width: 60,
      align: 'center',
    },
    {
      title: '教师姓名',
      dataIndex: 'name',
      align: 'center',
      width: 100,
    },
    {      
      title: '手机号',
      dataIndex: 'phone',
      align: 'center',
      width: 100,
      },
    {
      title: '总分',
      dataIndex: 'resultScore',
      align: 'center',
      width: 60,
    },
  ]

  const [columnsState, setColumnsState] = useState(fixedColumns);

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  const updateColumnData = (result: GT.Model.SubmitDetail) => {
    // 更新数据
    if (result.items !== undefined) {
      // 存在数据
      let newsLists = fixedColumns;
      newsLists.pop();
      result.items.forEach((item) => {
        const col = {
          title: item.name,
          dataIndex: item.id,
          align: 'center',
          width: 100,
        }
        newsLists.push(col as any);
      })
      const total = {
        title: '总分',
        dataIndex: 'resultScore',
        align: 'center',
        width: 60,
      }
      newsLists.push(total as any);
      setColumnsState(newsLists);
    }
  }

  const exportScore = () => {
        // 导出考评汇总表
    const params = form.getFieldsValue();
    api.assessment
      .exportAssessResultPoint({
        taskId: props.match.params.id,
        ...params,
        current: -1,
        size: -1,
      })
      .then(download);
  }

  return loadFlaging ?
  (<Row justify="center">
    <Spin
      style={{ marginTop: "30vh" }}
      spinning={loadFlaging}
      size="large"
    ></Spin>
  </Row>
  ) : ( (
    <div>
      <Row align="middle">
        <Col flex="0 2 3" style={{marginTop: isPublished && data?.needUpdate ? 10 : 0}}>
          <div style={{color:"#303133",fontSize:20,fontWeight:'bold',opacity:1}}>{props.match.params.name + "\xa0\xa0"}</div>
        </Col>
        <Col flex="0 0 60px" style={{marginTop: isPublished && data?.needUpdate ? 10 : 0}}>
          <div style={{ color: isPublished ? "#3CC251": "#FF8948",fontSize:12, width: '52px', height: '20px', borderRadius: '10px', backgroundColor: isPublished ? "#3CC25126": "#FF894826", textAlign: 'center', paddingTop: '1px'}}>{isPublished ? "已发布" : "未发布"}</div>
        </Col>
        <Col flex="0 0 90px">
          <PrivateComponent id={415}>
            <div style={{display: 'flex'}}>
              <Button type='primary' onClick={submitResult} loading={loading} style={{marginTop: isPublished && data?.needUpdate ? 10 : 0}}>
                {isPublished ? "更新发布" : "立即发布"}
              </Button>
              {isPublished && data?.needUpdate && <div style={{width: 70, height: 20, marginLeft: -26, zIndex: 1000, backgroundColor: '#FE4F54', fontSize: 11, color: '#FFFFFF', textAlign: 'center', borderRadius: '20px 20px 20px 0px'}}> 请及时更新 </div>}
            </div>
          </PrivateComponent>
        </Col>
        {data?.updateTime && <Col style={{marginTop: isPublished && data?.needUpdate ? 15 : 0}}>
          <div style={{ fontSize: 13, color: '#909499', marginLeft: isPublished && data?.needUpdate ? -35 : 5}}>{data?.updaterName} 于 {data?.updateTime} 最新更新</div>
        </Col>}
      </Row>
      <div style={{marginTop:10,marginBottom:10,background:"#FFFFFF",height:"1px"}}></div>
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
      <PrivateComponent id={416}>  
        <p>
          <Space>
            <Button type='primary' ghost
              onClick={exportScore}>
              导出考评汇总表
            </Button>
          </Space>
        </p>    
      </PrivateComponent>
      <Table style={appStyle.table}
        columns={columnsState}
        rowKey='id'
        {...tableProps}
        size='small'
        scroll={{scrollToFirstRowOnChange: true, x: 1400}}
        />
    </div>)
  )
}