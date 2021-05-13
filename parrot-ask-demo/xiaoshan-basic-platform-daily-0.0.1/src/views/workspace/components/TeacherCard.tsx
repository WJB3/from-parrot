import { useRequest } from 'ahooks';
import { Avatar, Badge, Button, Col, Divider, Empty, Row, Space } from 'antd';
import moment from 'moment';
import React from 'react';
import { useHistory } from 'react-router-dom';
import api from 'src/api';
import constant from 'src/constant';
import useMoment from 'src/hook/useMoment';
import GT from 'types';
export default function TeacherCard() {
  const { data, refresh } = useRequest(api.user.getTeacherMe);
  const {data: count} = useRequest(api.task.toDoCount);

  const { data: taskList } = useRequest( () => api.task.getPage({current: 0, size: 1, resultState: 0}).then((res)=> { return res.list}));
  const history = useHistory();

  return (
    <div>
      <p style={{ padding: '15px 20px', marginBottom: 6 }}>
        <b style={{ fontSize: 16 }}>{data?.name}</b>
      </p>
      <Row justify='center'>
        <Col span={6}>
          <p>
            <Avatar
              size={94}
              shape={'circle'}
              src={data?.url || 'https://api.xshs.cn:8688/frontend/xszx/defaultAvatar.png'}
            />
          </p>
        </Col>
        <Col span={2}></Col>
        <Col span={12} style={{ fontSize: 14, color: '#303133' }}>
          <p>工号：{data?.employeeNo}</p>
          <p>IC卡号：{data?.icCardNo}</p>
          <p style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            部门：{data?.departmentName}
          </p>
        </Col>
      </Row>

      <Divider style={{backgroundColor: '#E8EAF0', margin: '5px 20px', width: 320, minWidth: 320}} />
      <Row style={{ padding: "10px 20px", justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <b style={{ fontSize: 16, fontWeight: 'bold', color: '#333333'}}>待办事项</b>
            <Badge count={count} size='small' offset={[20, -5]}> </Badge>
          </div>
          <Button type='link' style={{marginRight: -15}} onClick={() => history.push("/message?tab=2")}>更多</Button>      
      </Row>

      <Row style={{padding: '0px 20px 15px 20px', background: '#fff'}}>
        { taskList && taskList!.length > 0 ? (<TodoTask task={taskList![0]} onCallBack={(task)=> {
          history.push("/message?tab=2")
        }}></TodoTask>) : (<Empty style={{width: '100%'}}
        image='https://api.xshs.cn:8688/frontend/empty.png'
        description={
          <Space size='small'>
            暂无待办事项
          </Space>
        }></Empty>)}
      </Row>
    </div>
  );
}

function TodoTask(props: { task: GT.Model.Task, onCallBack: (task: GT.Model.Task)=> void }) {
  const colors = ['#FF8948', '#9065F6', '#3CC251', '#FE4F54'];
  const stateColor = colors[props.task.state + 1] 
  const { date } = useMoment();
  let list: string[] = JSON.parse(props.task.extra || '[]');
  if (list.length > 4) {
    list = list.slice(0, 4);
    list[3] = `${list[3]}...`
  }
  return (
    <div style={{width: '100%', padding: "13px 15px", backgroundColor: '#F5F6FA', height: 134, borderRadius: 3}} onClick={()=>props.onCallBack(props.task)}>
      <Row style={{justifyContent: 'space-between', alignItems:'center', flexWrap: 'nowrap', marginBottom: 10}}>
        <div style={{display: 'flex', flexWrap: 'nowrap', alignItems: 'center'}}>
            <span style={{color: '#333333', fontSize: 16, maxWidth: 150, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginRight: 5}}>{props.task.toDoContent}</span>
            {<span style={{color: stateColor, border: `1px solid ${stateColor}`, borderRadius: 3, paddingLeft: 5, paddingTop: 1, paddingRight: 5, fontSize: 12, height: 21}}>{constant.taskState.type.get(props.task.state)}</span>}
        </div>
        <span style={{color: '#616266', fontSize: 12}}>{moment(props.task.createdTime).format("YYYY-MM-DD")}</span>
      </Row> 
      {/* {list.map( value => {
         return <p style={{color: '#84878C', fontSize: 13, marginBottom: 2}}>{value}</p>
      })} */}
      {<p style={{color: '#84878C', fontSize: 13, marginBottom: 2, whiteSpace: 'pre-line', textOverflow: 'ellipsis', overflow: 'hidden', height: '80px'}}>{list.join("\n")}</p> }
    </div>
  );
}
