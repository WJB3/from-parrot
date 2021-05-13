import React, { useRef, useState, useEffect } from 'react'
import { Table, Form, Input, Row, Button, Space, Select, Modal, message, Col } from 'antd';
import PrivateComponent from 'src/components/PrivateComponent';
import useDictionary from 'src/hook/useDictionary';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useRequest } from 'ahooks';
import { ColumnsType } from 'antd/es/table';
import appStyle from 'src/App.style';
import constant from 'src/constant';
import api from 'src/api';
import GT, { Model } from 'types';
import { RouteComponentProps, useRouteMatch } from 'react-router-dom';
import useApp from 'src/hook/useApp';
import useDownload from 'src/hook/useDownload';
import OneLineText from 'src/components/OneLineText';
import useSocket from "src/hook/useSocket";
import IconFont from 'src/components/IconFont';
import { useGlobalState, ActionType } from "src/store";

// 汇总记录列表页面
export default function AwardRecordListPage(props: RouteComponentProps<{ id: any, name: any }>) {
  const [form] = Form.useForm();
  const { renderText, renderSelect } = useDictionary();
  const [rows, setRows] = useState<GT.Model.ReporAwardDetailModel[]>([]);

  const { parseURL } = useApp();
  const match = useRouteMatch();
  const { id, pageId } = parseURL(match.path);
  const [awardLevels, setAwardLevels] = useState<GT.Model.AwardLevelModel[]>();
  const { download } = useDownload();
  const [showDownLoad, setShowDownLoad] = useState(false);
  const [loadDataDetails, setLoadDataDetails] = useState<GT.DTO.AwardPdfExtra>();
  const [loadModalVisible, setLoadModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  // const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  // const [selectedData, setSelectedData] = useState<GT.Model.ReporAwardDetailModel>();
  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: "汇总记录" }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);

  const { listen } = useSocket();
  useEffect(()=> {
    // 监听pdf云端生成
    return listen({type: 1, handler: (e) => {
      //获取下载的数据
      let data: GT.DTO.AwardPdfExtra = JSON.parse(e.extra || '{}');
      // e.extra 是Map
      setLoadDataDetails(data);
      setShowDownLoad(true);
    }});
  }, []);

  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) =>
  api.award.getRecordPage({
    ...formData,
    taskId: props.match.params.id,
    current,
    size,
  });

  const {data: formData } = useRequest(() => api.award.getByRecordId(), {
    refreshDeps:[],
    onSuccess(result) {
      setAwardLevels(result);
    },
  });

  // 请求获取最新的证书
  const getLastestPdf = () => {
    api.award.getLastestCert().then((data)=> {
      // 判断是否获取到最新的数据
      if (data&&data.url.length > 0) {
        // 成功 是否使用现有数据
        setLoadDataDetails(data);
        setUpdateModalVisible(true);
      } else {
        // 请求云端数据
        // message.success('已发起下载申请，稍后请在当前页面下载', 5);
        downLoadCertRecord();
      }
    });
  }

  // 生成pdf成功的回调
  const downAllPdf = () => {
    const data = {fileName: loadDataDetails?.name ? loadDataDetails.name : '', url: loadDataDetails?.url ? loadDataDetails.url : ''}
    console.log(data);
    message.success('文件下载中，请耐心等候', 5);
    download(data);
  }

  // 删除pdf展示
  const deletePdf = () => {
    setShowDownLoad(false);
  }

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });

  const { submit, reset } = search;

  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.ReporAwardDetailModel[]) => {
    setRows(selectedRows);
  };

  // 导出上报汇总表
  const exportAllRecord = () => {
    api.award
      .exportAllRecord({
        taskId: props.match.params.id,
      })
      .then(download);
  }

  // 导出汇总表
  const exportSearchRecord = () => {
    // 获取form数据
    let params = form.getFieldsValue();
    api.award
      .exportSearchRecord({
        taskId: props.match.params.id,
        ...params,
      })
      .then(download);
  }

  // 下载证书文件
  const downLoadCertRecord = () => {
    api.award
      .downloadRecordCert({
        taskId: props.match.params.id,
      }).then(()=> {
          message.success('已发起下载申请，稍后请在当前页面下载', 5);
      });
  }

  // 删除记录
  const onDelete = (render: GT.Model.ReporAwardDetailModel) => {
    // 赋值
    Modal.confirm({
      title:
        "删除后当前填报记录会被清除，填报对象可以重新发起提交，确认删除吗？",
      onOk: () => {
        api.award.deleteRecords(render.id).then(() => {
          message.success('删除成功');
          refresh();
        });
      },
    });
  };

  const handleLoadModalOk = () => {
    // 打包
    getLastestPdf();
    setLoadModalVisible(false);
  };

  const handleLoadModalCancel = () => {
    // 不打包
    setLoadModalVisible(false);
  };

  const handleUpdateModalOk = () => {
    // 重新下载
    downLoadCertRecord();
    // message.success('已发起下载申请，稍后请在当前页面下载', 5);
    setUpdateModalVisible(false);
  };

  const handleUpdateModalCancel = () => {
    // 使用服务端的数据
    setShowDownLoad(true);
    setUpdateModalVisible(false);
  };

  // const handleDeleteModalOk = () => {
  //   // 删除数据
  //   selectedData&&api.award.deleteRecords(selectedData.id).then(() => {
  //     message.success('删除成功');
  //     setDeleteModalVisible(false);
  //     refresh();
  //   });
  // };

  // const handleDeleteModalCancel = () => {
  //   // 取消
  //   setDeleteModalVisible(false);
  // };

  const style: GT.Model.Style = {
    icon: {
      fontSize: 14,
    },
  };

  const renderDownLoad = () => {
    // 渲染downLoad组件
    return <div style={{width: 370, height:34, borderRadius: 3, backgroundColor: '#E4E7F0FF'}}>
      <Row justify='start' align='middle'>
        <Col flex={2} style={{paddingLeft: '8px'}}>
          <IconFont type='iconfujian' style={style.icon}></IconFont>
        </Col>
        <Col flex={20}>
          <div style={{display: 'flex', flexWrap: 'nowrap'}}>
            <span style={{color: '#303133', fontSize: 13, maxWidth: 130, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{loadDataDetails?.name}</span>
          </div>
        </Col> 
        <Col flex={5}>
          <div style={{display: 'flex', flexWrap: 'nowrap'}}>
            <span style={{color: '#909499', fontSize: 13, maxWidth: 54, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{((loadDataDetails?.fileSize ?? 0) / 1024 / 1024).toFixed(2) + 'M'}</span>
          </div>        </Col> 
        <Col flex={7}>
          <div>
            <Button style={{fontSize: 12, height: 26}}
               type={'primary' }
               onClick={downAllPdf}>
               开始下载
            </Button>
          </div>
        </Col>
        <Col flex={2}>
          <div>
            <Button icon={<IconFont type='icondelete1-copy'></IconFont>} 
              ghost
              style={{borderColor: '#E4E7F0FF'}}
              onClick={deletePdf}>  
              </Button>
          </div>
        </Col>
      </Row>
    </div>
  }

  const renderApprovalState = (state: number) => {
    let color = '';
    switch (state) {
      case -2:
        color = '#FE4F54';
        break;
      case -1:
        color = '#FF8948';
        break;
      case 0:
        color = '#9065F6';
        break;
      case 1:
        color = '#3CC251';
        break;
      case 2:
        color = '#FE4F54';
        break;
      default:
        break;
    }
    return (
      <div style={{ color: color, 
         textAlign: "center"}}> 
        {renderText('taskApprovalStatus', state)}
      </div>
    );
  };

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  const columns: ColumnsType<GT.Model.ReporAwardDetailModel> = [
    {
      title: '序号',
      render: (text, record, index) => index + 1,
      fixed: true,
      align: 'center',
      width: 55,
    },
    {
      title: '竞赛名称',
       dataIndex: 'contestName',
       align: 'center',
       render: (val) => <OneLineText maxWidth={120}>{val}</OneLineText>,
       width: 120,
    },
    {      
      title: '竞赛类型',
      dataIndex: 'contestType',
      align: 'center',
      render: (val) => renderText('contestType', val),
      width: 80,
     },
     {      
      title: '竞赛级别',
      dataIndex: 'contestLevel',
      align: 'center',
      render: (val) => renderText('stuContestLevel', val),
      width: 80,
     },
     {
      title: '获奖等级',
      dataIndex: 'awardLevelName',
      align: 'center',
      render: (val) => <OneLineText maxWidth={100}>{val}</OneLineText>,
      width: 100,
      },
      {
        title: '颁奖部门',
        dataIndex: 'department',
        align: 'center',
        render: (val) => <OneLineText maxWidth={120}>{val}</OneLineText>,
        width: 120,
      },
      {
        title: '获奖日期',
        dataIndex: 'detailDate',
        align: 'center',
        width: 120,
      },
      {
        title: '指导教练',
        dataIndex: 'teacherNames',
        align: 'center',
        render: (val) => <OneLineText maxWidth={120}>{val}</OneLineText>,
        width: 120,
      },
      {
        title: '获奖类型',
        dataIndex: 'type',
        render: (value) => renderText('awardType', value),
        align: 'center',
        width: 150,
      },
      {
        title: '获奖学生',
        dataIndex: 'studentNames',
        align: 'center',
        render: (val) => <OneLineText maxWidth={250}>{val}</OneLineText>,
        width: 250,
      },
      {
        title: '审批状态',
        dataIndex: 'state',
        render: (value) => renderApprovalState(value),
        align: 'center',
        width: 80,
      },
      {         
        title: '操作',
        align: 'center',
        fixed: 'right',
        render: (text, record) => (
          <Space>
            <PrivateComponent id={385}>
              <Button 
                size='small' 
                type='link'
                onClick={() => {
                  // console.log(pageId, id);
                  props.history.push(`/app/${id}/${pageId}/CheckDetail/${record.id}?onlyShow=${'1'}`);
                }}>
                查看
              </Button>
            </PrivateComponent>
            <PrivateComponent id={386}>
              <Button 
                size='small' 
                type='link'
                danger
                onClick={() => onDelete(record)}>
                删除
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
            <Form.Item label='审批状态' name='state'>
              {renderSelect('taskApprovalStatus')}
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
            <Form.Item label='指导教练' name='teacherName'>
              <Input placeholder='请输入' />
            </Form.Item>
            <Form.Item label='获奖学生' name='studentName'>
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
      <PrivateComponent id={[382, 383, 384]}>
        <p>
          <Space>
            <PrivateComponent id={382}>
              <Button type='primary' ghost onClick={exportAllRecord}>
                导出上报汇总表
              </Button>
            </PrivateComponent>
            <PrivateComponent id={383}>
              <Button type='primary' ghost onClick={exportSearchRecord}>
                导出汇总表
              </Button>
            </PrivateComponent>
            <PrivateComponent id={384}>
              <Button type='primary' ghost onClick={()=>setLoadModalVisible(true)}>
                下载证书文件
              </Button>
            </PrivateComponent>
            {showDownLoad ? (
              <PrivateComponent id={384}>
                {renderDownLoad()}
              </PrivateComponent>
            ): null}
          </Space>
        </p>
      </PrivateComponent>
      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        size='small'
        scroll={{ scrollToFirstRowOnChange: true, x: 1500 }}
      />
      <Modal
        title="下载提醒"
        visible={loadModalVisible}
        onOk={handleLoadModalOk}
        onCancel={handleLoadModalCancel}>
          <p>文件将在您确认之后开始打包生成，云端打包成功后即可在当前页面下载文件</p>
      </Modal>
      <Modal
        title="提示"
        visible={updateModalVisible}
        onOk={handleUpdateModalOk}
        onCancel={handleUpdateModalCancel}>
          <p>检测到服务端已有下载链接，是否删除并重新打包下载文件</p>
      </Modal>
      {/* <Modal
        title="提示"
        visible={deleteModalVisible}
        onOk={handleDeleteModalOk}
        onCancel={handleDeleteModalCancel}>
          <p>删除后当前的填报记录会被清除, 填报对象可以重新发起提交, 确认删除吗？</p>
      </Modal> */}
    </div>
  )
}
