import React from "react";
import { Row, Carousel } from 'antd';
import { useRequest } from 'ahooks';

import GT from 'types';
import api from 'src/api';
import constant from 'src/constant';
import useMoment from "src/hook/useMoment";
import IconFont from "src/components/IconFont";
import { useHistory } from "react-router-dom";
import useSocket from "src/hook/useSocket";
import moment from "moment";

export default function NewMessageCard() {
  const { datetime_m } = useMoment();
  const history = useHistory();

  const {data: list} = useRequest(() => api.message.getPage({current: 1, size: 3, readState: false}).then((res) => res.list));
  const onRead = (records?: GT.Model.Message[]) => {
    api.message.read({all: false, ids: records?.map((record) => record.id)}).then( () => {});
  };

  const showDetail = (model: GT.Model.Message) => {
    onRead([model]);
    if (model.sourceType == 1) {
      // 系统消息无详情查看
      return;
    }
    if (model.url) {
      if (model.url === "/app/362") {
        const ext = JSON.parse(model.extra);
        if (ext.relatedId) {
          history.push(`/app/362/366/LeaveDetail/${ext.relatedId}`);
        }
      } else if(model.url === "/app/427") {
        if (model.extra == undefined) {
          return
        }
        const ext = JSON.parse(model.extra);
        if (ext.taskId) {
          history.push(`/app/427/428/ResultDetail/${ext.taskId}`);
        }
      } else {
        if (model.sourceType === 3 && model.url === "/app/204") {
          // 跳转到成果申报详情页面
          if (model.extra == undefined) {
            history.push(model.url!);
            return
          }
          const ext = JSON.parse(model.extra);
          if (ext.taskId) {
            // 跳转对应的成果详情
            api.task.getMyDeclareDetail(ext.taskId).then((res) => {
              // history.push(`${model.url!}?id=${ext.taskId}`);
              history.push(model.url!);
            })
          }  else {
            history.push(model.url!);
          }
        } else {
          history.push(model.url!);
        }
      }
    }
  };

  return list != undefined && list!.length > 0 ? (
    <Row style={{background: '#FFF0D2', border: '1px solid #E89C05', borderRadius: 2, height: 32, flexFlow: 'row', alignContent: 'space-between', alignItems: 'center'}}>
      <div style={{display: "flex", alignItems: 'center', width: '95%', height: '100%'}}>
        <IconFont type='iconvolume-1' style={{padding: '0px 10px'}}></IconFont>
        {list!.length > 1 ?
          (<Carousel dotPosition='left' autoplay={true} autoplaySpeed={6000} dots={false} style={{color: '#E89C05', height: '32'}}>
          {list!.map((model) => {
          return (
            <div onClick={() => showDetail(model)} style={{color: '#E89C05', fontSize: 13, width: '100%', height: '32'}}>
              <span>[{constant.messageType.type.get(model.type)}]</span>
              <span>{model.content}</span>
              <span style={{marginLeft: 20}}>{moment(model.createdTime).format("YYYY-MM-DD HH:mm")}</span>
            </div>)
          })}
          </Carousel>) :
          (<div onClick={() => showDetail(list![0])} style={{color: '#E89C05', fontSize: 13, width: '100%', height: '32'}}>
          <span>[{constant.messageType.type.get(list![0].type)}]</span>
          <span>{list![0].content}</span>
          <span style={{marginLeft: 20}}>{moment(list![0].createdTime).format("YYYY-MM-DD HH:mm")}</span>
          </div>)
         }

      </div>
      <div style={{height: '100%', alignItems: 'center', display: "flex"}} onClick={() => history.push('/message')}>
        <span style={{color: '#E89C05', fontSize: 13, marginRight: 6}}>更多</span>
        <IconFont type='iconmoreyellow' style={{fontSize: 9}}></IconFont>
      </div>
    </Row>
  ) : null;
}