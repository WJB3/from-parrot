import React, { useRef, useState, useEffect } from 'react'
import { Table, Form, Input, Row, Button, Space, Col, Select, message } from 'antd';
import PrivateComponent from 'src/components/PrivateComponent';
import useDictionary from 'src/hook/useDictionary';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useRequest } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import appStyle from 'src/App.style';
import constant from 'src/constant';
import api from 'src/api';
import GT, { Model } from 'types';
import ReceivePersonModal from './component/ReceivePerson'
import { RouteComponentProps } from 'react-router-dom';
import useDownload from 'src/hook/useDownload';
import OneLineText from 'src/components/OneLineText';
import { useGlobalState, ActionType } from "src/store";

// 得分考评列表页面
export default function AwardPointListPage(props: RouteComponentProps<{ id: any, name: any }>) {
  const [form] = Form.useForm();
  const { renderText, renderSelect } = useDictionary();
  const [totalScore, setTotalScore] = useState<number>()
  const { download } = useDownload();
  const [awardLevels, setAwardLevels] = useState<GT.Model.AwardLevelModel[]>();
  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: "得分考评" }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);

  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) =>
  api.award.getAwardPointPage({
    ...formData,
    taskId: props.match.params.id,
    current,
    size,
  });

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
    formatResult: (res) => (
      setTotalScore(res.totalScore),
      res.scores
    ),
    // onSuccess: (res) => (
    //   console.log(res),
    //   // setTotalScore(res.totalScore)
    // ),
  });

  const { submit, reset } = search;

  const exportScore = () => {
    const params = form.getFieldsValue();
    // 导出汇总表
    api.award
      .exportScorePoint({
        taskId: props.match.params.id,
        ...params,
      })
      .then(download);
  }

  const downAwardCert = (render: GT.Model.AwardPointModel) => {
    // 下载证书
    api.award
      .downloadAwardCert({
        awardLevelName: render.awardLevelName,
        contestLevel: render.contestLevel,
        contestName: render.contestName,
        contestType: render.contestType,
      })
      .then(download);
  }

  const {data: formData } = useRequest(() => api.award.getByRecordId(), {
    refreshDeps:[],
    onSuccess(result) {
      setAwardLevels(result);
    },
  });

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  const columns: ColumnsType<GT.Model.AwardPointModel> = [
    {
      title: '序号',
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
    },
    {
      title: '竞赛名称',
       dataIndex: 'contestName',
       align: 'center',
       render: (val) => <OneLineText maxWidth={160}>{val}</OneLineText>,
    },
    {      
      title: '竞赛类型',
      dataIndex: 'contestType',
      align: 'center',
      render: (val) => renderText('contestType', val),
     },
     {      
      title: '竞赛级别',
      dataIndex: 'contestLevel',
      align: 'center',
      render: (val) => renderText('stuContestLevel', val),
     },
     {
      title: '获奖等级',
      dataIndex: 'awardLevelName',
      align: 'center',
      render: (val) => <OneLineText maxWidth={100}>{val}</OneLineText>,
      },
      {
        title: '获奖数量',
        dataIndex: 'recordCount',
        align: 'center',
      },
      {
        title: '得分',
        dataIndex: 'score',
         align: 'center',
      },
      {         
        title: '操作',
        align: 'center',
        fixed: 'right',
        render: (text, record) => (
          <Space>
            <PrivateComponent id={388}>
              <Button 
                size='small' 
                type='link'
                onClick={() => downAwardCert(record)}>
                证书下载
              </Button>
            </PrivateComponent>
          </Space>
        ),
      }
   ]

  return (
    <div>
      <div style={{color:"#303133",fontSize:16,fontWeight:400,opacity:1}}>{props.match.params.name}</div>
      <div style={{marginTop:10,marginBottom:20,background:"#DFE1E6",height:"1px"}}></div>
      <Row align='middle'>
        <Col span={0.5}>
          <p style={{ color: '#616266', fontSize: 13, height: 30, verticalAlign: 'middle', paddingTop: 1}}>{'总得分' + '\xa0'}</p>
        </Col>
        <Col span={1}>
          <p style={{ color: '#FF8948', fontSize: 19, height: 30, verticalAlign: 'middle' }}>{`  ${totalScore}`}</p>
        </Col>
      </Row>
      <Form form={form} className='search_form'>
        <Row>
          <Row className='search_form_items'>
            <Form.Item label='竞赛名称' name='contestName'>
              <Input placeholder='请输入' />
            </Form.Item>
            <Form.Item label='竞赛类型' name='contestType'>
              {renderSelect('contestType')}
            </Form.Item>
            <Form.Item label='竞赛级别' name='contestLevel'>
              {renderSelect('stuContestLevel')} 
            </Form.Item>
            <Form.Item label='获奖等级' name='awardLevelId'>
              {/* 获奖等级下拉选择 */}
              <Select
                placeholder="请选择">
                  {awardLevels?.map((level) => (
                    <Select.Option value={level.id}>{level.name}</Select.Option>
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
      <PrivateComponent id={387}>  
        <p>
          <Space>
            <Button type='primary' ghost
              onClick={exportScore}>
              导出汇总表
            </Button>
          </Space>
        </p>    
      </PrivateComponent>
      <Table style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        size='small'/>
      <div style={{backgroundColor: '#B8C4E62E', height: '60px', borderRadius: '5px', marginTop: '30px'}}>
        <span style={{width: '3px', height: '13px', borderRadius: '1.5px', backgroundColor: '#5781F2', marginLeft: '12px',display: 'inline-block',marginTop: '14px' }}> </span>
        <span style={{color: '#303133', fontWeight: 'bold', fontSize: '14px', opacity: 1, marginLeft: '4px'}}>说明</span>
        <br/>
        <span style={{color: '#616266', fontSize: '13px', marginLeft: '12px'}}>得分计算规则：省级及以上级别竞赛得分=获奖数量*3；省级以下区级及以上竞赛得分=获奖数量*2</span>
      </div>
    </div>
  )
}
