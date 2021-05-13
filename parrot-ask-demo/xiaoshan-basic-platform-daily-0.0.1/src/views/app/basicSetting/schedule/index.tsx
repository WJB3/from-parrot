import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { Button, message, Modal, Radio, Space, Switch, Table } from 'antd';
import { ColumnType } from 'antd/es/table/interface';
import { CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import React, { useRef, useState,useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import useUrlState from '@ahooksjs/use-url-state';
import api from 'src/api';
import appStyle from 'src/App.style';
import OneLineText from 'src/components/OneLineText';
import PrivateComponent from 'src/components/PrivateComponent';
import GT from 'types';
import ScheduleCheckResultModal from './component/CheckResult';
import { useRequest } from 'ahooks';
import useMoment from 'src/hook/useMoment';
import EditScheduleBeginModal from './component/EditSchedule';

export default function SchedulePage(props: RouteComponentProps) {
  const { moment } = useMoment();
  const [state, setState] = useUrlState({ type: null });
  const [title, setTitle] = useState('冬令时')
  const [list,setList] = useState([]) 
  const [list1,setList1] = useState([]) 
  // useEffect(()=>{
  //   useRequest(api.schedule.getAll, {
  //     onSuccess(data:any) {
  //       const tit = data?.[0].ranges[0].isEnable === 1 ? '冬令时' : '夏令时' 
  //       !state.type &&
  //         setState({
  //           type: data?.[0].ranges[0].isEnable === 1 ? '2' : '1',
  //         });
  //     },
  //   });
  // },[])
  const { data, refresh } = useRequest(api.schedule.getAll, {
    onSuccess(data:any) {
      console.log('data',data)
      setList(data[0].ranges)
      setList1(data[1].ranges)
      const tit = data?.[0].ranges[0].isEnable === 1 ? '冬令时' : '夏令时' 
      !state.type &&
        setState({
          type: data?.[0].ranges[0].isEnable === 1 ? '2' : '1',
        });
    },
  });
  
  const checkModal = useRef<GT.Modal.Ref>();
  const onCheck = () => {
    api.schedule.check().then((res) => {
      checkModal.current?.setVisible(true);
      checkModal.current?.setData(res);
    });
  };
  const current: any = data?.find((item:any) => item.id.toString() === state.type);
  console.log('current',current)
  const columns: ColumnType<GT.Model.ScheduleRange>[] = [
    {
      title: '学段',
      dataIndex: 'sectionName',
      align: 'center',
      render: (val, record, index) => {
        return {
          children: val,
          props: {
            style: {
              padding: '10px 0',
            },
            rowSpan:
              current?.ranges[index - 1]?.sectionName === val
                ? 0
                : current?.ranges?.filter((item:any) => item.sectionName === val).length,
          },
        };
      },
    },
    {
      title: '年级',
      dataIndex: 'gradeName',
      align: 'center',
    },
    {
      title: '是否启用',
      dataIndex: 'isEnable',
      align: 'center',
      render: (val, record) =>
        val === 0 ? (
          <CheckCircleFilled style={{ color: '#43C157', fontSize: 16 }} />
        ) : (
          <CloseCircleFilled style={{ color: '#84878C', fontSize: 16 }} />
        ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      render: (val) => <OneLineText maxWidth={500}>{val}</OneLineText>,
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      render: (val, record) => {
        return (
          <Space size='small'>
            <PrivateComponent id={293}>
              <Button
                type='link'
                size='small'
                onClick={() => {
                  props.history.push(`${props.location.pathname}/schedule/${val}`);
                }}>
                预览
              </Button>
            </PrivateComponent>
            <PrivateComponent id={294}>
              <Button
                type='link'
                size='small'
                onClick={() => {
                  props.history.push(
                    `${props.location.pathname}/schedule/${val}/edit?type=${record.restId}`,
                  );
                }}>
                编辑
              </Button>
            </PrivateComponent>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
     <p>
        <Radio.Group
          value={state.type}
          className='page_tab'
          buttonStyle='solid'
          onChange={(e) => {
            setState({
              type: e.target.value,
            });
          }}>
          
         {/* {data?.map((tab: any) => (
            <Radio.Button value={tab.id.toString()}>{tab.restName}</Radio.Button>
          ))} */}
          {/* {data?.map((tab: any) => (
            
            // <Radio.Button>{ data[0].restName}</Radio.Button>
          ))} */}
      
        </Radio.Group>

      </p>
     

     
      {current ? (
        <p>
          {/* <p>当前{ current?.restName}</p> */}
          <p>当前{ title}</p>
          <Space>
            <span style={{ fontSize: 28, fontWeight: 500 }}>
              {moment(current.beginTime).format('MM月DD日起执行')}
            </span>
         
            <Button
              type='primary'
              ghost
              onClick={() => {
                checkModal.current?.setVisible(true);
                checkModal.current?.form?.setFieldsValue({
                  ...current,
                  beginTime: moment(current.beginTime).format('MM月DD日'),
                });
              }}>
              修改执行日期
            </Button>
            <Button onClick={() => {
              if (data[0].ranges[0] === '夏令时') {
                setState({
                  type: data[0].ranges[0].isEnable === 1 ? '2' : '1',
                });
              }
              if(title==='夏令时'){
                setTitle('冬令时')
              }else{
                setTitle('夏令时')
              }
            }}>查看{title==='夏令时'?'冬令时':'夏令时'}
            </Button>
          </Space>
        </p>
      ) : null}
      
      <Table
        style={appStyle.table}
        className='table_no_hover'
        columns={columns}
        rowKey='id'
        bordered
        dataSource={title==='夏令时'?list: list1}
        pagination={false}
        scroll={{ scrollToFirstRowOnChange: true }}
      />
      <EditScheduleBeginModal
        onRef={(ref) => (checkModal.current = ref)}
        onOk={refresh}></EditScheduleBeginModal>
    </div>
  );
}
