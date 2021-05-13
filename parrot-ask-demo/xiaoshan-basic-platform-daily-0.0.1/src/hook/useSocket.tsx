import { notification, Row } from 'antd';
import { listenerCount } from 'process';

import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'src/api';
import instance, { refreshToken } from 'src/api/request';
import constant from 'src/constant';
import { ActionType, useGlobalState } from 'src/store';
import { token } from 'src/utils';
import GT from 'types';
export default function useSocket() {
  const [state, dispatch] = useGlobalState();
  const history = useHistory();
  const [socket, setSocket] = useState<WebSocket>();
  const init = async () => {
    let timer: any;
    let ws = new WebSocket(
      `${instance.defaults.baseURL?.replace(
        'https',
        'wss',
      )}/message/wss?token=${token.get()}&deviceId=${await api.base.getDeviceSign()}`,
    );
    ws.onopen = (e) => {
      // 心跳
      setSocket(ws);
      const heartBeat = () => {
        ws.send('ping');
        timer = setTimeout(() => {
          heartBeat();
        }, 5 * 60 * 1000);
      };
      heartBeat();
    };
    ws.onclose = (e) => {
      setSocket(undefined);
      clearTimeout(timer);
      // 断开之后10s后重连
      setTimeout(() => {
        init();
      }, 10000);
    };
  };
  // 展示消息时已有多少条消息
  const count = useRef(1);
  // 每次修改socket和handlers 重新监听
  useEffect(() => {
    if (socket) {
      socket.onmessage = (e) => {
        // console.log(e, state.socketHandlers);
        // console.log(`count: ${count.current}`);
        if (e.data === 'pong') {
          return false;
        }
        // token 失效重连
        if (e.data === 'expired') {
          refreshToken().then((ret) => {
            socket.close();
          });
          return false;
        }
        let data: GT.Model.SocketMessage = JSON.parse(e.data || '{}');
        switch (data.pushType) {
          case 1:
            switch (data.type) {
              case 1:
              case 2:
              case 3:
                setTimeout(() => {
                  notification.open({
                    message: <span style={{ fontSize: 15, fontWeight: 'bold', color: '#303133' }}>{data.title}</span>,
                    onClick: () => {
                      if (data.sourceType == 1) {
                        return;
                      }
                      if (data.url) {
                        api.message.read({all: false, ids: [data.id]}).then( () => {});
                        if (data.url === "/app/362") {
                          history.push(`/app/362/366/LeaveDetail/${data.relatedId}`);
                        } else if(data.url === "/app/427") {
                          if (data.extra == undefined) {
                            return
                          }
                          const ext = JSON.parse(data.extra);
                          if (ext.taskId) {
                            history.push(`/app/427/428/ResultDetail/${ext.taskId}`);
                          }
                        } else {
                          // 兼容消息中心的成果申报跳转
                          if (data.sourceType === 3 && data.url === "/app/204") {
                            // 跳转到成果申报详情页面
                            if (data.extra == undefined) {
                              history.push(data.url);
                              return
                            }
                            const ext = JSON.parse(data.extra);
                            if (ext.taskId) {
                              // 跳转对应的成果详情 
                              api.task.getMyDeclareDetail(ext.taskId).then((res) => {
                                // history.push(`${data.url}?id=${ext.taskId}`);
                                history.push(data.url!);
                                // history.push(`${data.url}`, {id: ext});
                              })
                            }  else {
                              history.push(data.url);
                            }
                          } else {
                            history.push(data.url);
                          }
                        }
                      }
                    },
                    duration: 4.5,
                    description: (
                    <div>
                      <span style={{ fontSize: 13, color: '#84878C'}}>{data.content}</span>
                      <br/>
                      <span style={{ fontSize: 13, color: '#5781F2', fontWeight: 'bold', marginLeft: -8}}>【{data.sourceType == 1 ? "系统通知" : data.sourceName}】</span>
                    </div>),
                    top: 84,
                  });
                  count.current = count.current - 1;
                }, 500 * count.current);
                break;
              case 4:
                setTimeout(() => {
                  notification.open({
                    message: <span style={{ fontSize: 15, fontWeight: 'bold', color: '#303133'}}>待办事项</span>,
                    onClick: () => {
                      history.push("/message?tab=2");
                      // if (data.relatedId) {
                      //   if (data.relatedType == 1) {
                      //     // 学生填报
                      //     history.push(`/app/345/356/approvalDetail/${data.relatedId}`)
                      //   } else {
                      //     // 教师填报
                      //      history.push(`/app/345/356/teacherReport?recordId=${data.relatedId}&roleType=2`)
                      //   }
                      // }
                    },
                    duration: 4.5,
                    description: (
                    <div>
                      <span style={{ fontSize: 13, color: '#84878C'}}>{data.content + ', ' + constant.taskState.type.get(data.state)}</span>
                      <br/>
                      <span style={{ fontSize: 13, color: '#5781F2', fontWeight: 'bold', marginLeft: -8}}>【{data.sourceType == 1 ? "系统通知" : data.sourceName}】</span>
                    </div>),
                    top: 84,
                  });
                  count.current = count.current - 1;
                }, 500 * count.current);
                break;
              default:
                break;
            }
            state.socketHandlers.forEach((h) => {
              if (h.type) {
                h?.handler(e);
              }
            });
            break;
          default:
            state.socketHandlers.forEach((h) => {
              if ((h.type && h.type === data.businessType) || !h.type) {
                h?.handler(data);
              }
            });
            break;
        }
        count.current = count.current + 1;
      };
    }
  }, [socket, state.socketHandlers]);
  const listen = (options: GT.Model.SocketHandler) => {
    const len = state.socketHandlers.length;
    dispatch({
      type: ActionType.AddSocketHandler,
      payload: options,
    });
    return () =>
      dispatch({
        type: ActionType.RemoveSockerHandler,
        payload: len,
      });
  };
  return {
    init,
    listen,
  };
}
