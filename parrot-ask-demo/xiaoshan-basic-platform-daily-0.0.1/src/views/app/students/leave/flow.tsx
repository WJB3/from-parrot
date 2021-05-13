import { useRequest } from 'ahooks';
import { Form, Row, Space, Spin, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import api from 'src/api';
import constant from 'src/constant';
import { useGlobalState } from 'src/store';
import { token } from 'src/utils';
import { refreshToken } from 'src/api/request';

export default function WorkFlowPage() {
  const [state, ] = useGlobalState();
  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState('');

  useEffect(() => {
    api.base.getWorkflowModel(3).then((res) => {
      const url = `${state.permissions?.get(406)?.path}?token=${token.get()}&refreshToken=${token.getRefresh()}${"&id="+ res}`;
      // console.log(url);
      setSrc(url);
      setLoading(false);

      window.addEventListener(
        'message',
        (event) => {
          console.log(res);
          if (event.data.type === 'refreshToken') {
            console.log(event, 'flow- 收到打开弹窗的消息');
            // 刷新token
            refreshToken().then( e => {
              const url = `${state.permissions?.get(406)?.path}?token=${token.get()}&refreshToken=${token.getRefresh()}${"&id="+ res}`;
              // console.log(url);
              setSrc(url);
              (document.getElementById('iframe') as HTMLIFrameElement)?.contentDocument?.location.reload();
              // (document.getElementById('iframe') as HTMLIFrameElement)?.contentWindow?.location.reload();
              // (document.getElementById('iframe') as HTMLIFrameElement)?.contentWindow?.postMessage({type: 'refreshed', token: token.get(), refreshToken:  token.getRefresh()},'*')
            });
          } 
        }, false);
    }).catch((e) => {
      setLoading(false);
    });
  }, [])

  return loading? (
    <Row justify="center">
      <Spin
        style={{ marginTop: "30vh" }}
        spinning={loading}
        size="large"
      ></Spin>
    </Row>
  ) :  <iframe
  id='iframe'
  frameBorder={0}
  width={'100%'}
  style={{ height: 'calc(100vh - 155px)' }}
  src={src} />
  // src={`${state.permissions?.get(Number(props.match.params.pageId))?.path}?token=${token.get()}&refreshToken=${token.getRefresh()}${searchParams.id ? "&id="+ searchParams.id : ""}`}></iframe>}}>   

  // const { data } = useRequest(() => api.base.getWorkflows(3));

  // const handler = (list?: any[]) => {
  //   if (list == undefined || list!.length <= 0) {
  //     return;
  //   }
  //   const groupBy = (array: any[], f: Function) => {
  //     const groups: {[key: string]: any[]} = {};
  //     array.forEach((item) => {
  //       const group = f(item);
  //       groups[group] = groups[group] || [];
  //       groups[group].push(item);
  //     });
  //     return Object.keys(groups).map((group) => {
  //       return groups[group];
  //     });
  //   };
  //   const sorted = groupBy(list!, (item: any) => {
  //     return item.flowCondition;
  //   });
  //   let results: {title: string, list: any[]}[] = [];
  //   const tips = ["条件一：请假时间小于等于", "条件二：请假时间大于"];
  //   const keys = ["\$lte", "\$gt"];
  //   for (let index = 0; index < sorted.length; index++) {
  //     const element = sorted[index][0];
  //     const flowConditionList = JSON.parse(element.flowCondition);
  //     const units: any = {"m": "分钟", "h": "小时", "d": "天"};
  //     if (flowConditionList && flowConditionList.length > 0) {
  //       const flowCondition = flowConditionList[0];
  //       let key = flowCondition.value[keys[index]];
  //       let unit = flowCondition.unit;
  //       if (flowCondition.unit == "m") {
  //         key = key / 60;
  //         unit = "小时";
  //       } else {
  //         unit = units[unit];
  //       }
  //       results.push({title: `${tips[index]}${key}${unit}`, list: sorted[index]});  
  //     }
  //   }
  //   console.log(results);
  //   return results;
  // };
  // const options = handler(data);
  // const [checked, setChecked] = useState(true);

  // return (
  //   <Row justify='center'>
  //     <Form {...constant.form.layout} style={{ width: 1000 }}>
  //       <p style={{ fontSize: 20, textAlign: 'center' }}>
  //         <b>审批设置</b>
  //       </p>
  //       <Form.Item label='是否开启'>
  //         <Space>
  //           <Switch disabled checked={checked} onChange={setChecked}></Switch>
  //           <span>{checked ? '已开启' : '已关闭'}</span>
  //         </Space>
  //       </Form.Item>
  //       <Form.Item label='审批流程'>
  //         <div style={{display: 'flex', justifyContent: 'space-between'}}>
  //           {options && options.map((item) => {
  //             return (<div style={{width: 300, marginTop: 5}}>
  //                 <p>{item.title}</p>
  //                 {item.list.map((model) => {
  //                   return (
  //                     <div>
  //                     <p style={{marginTop: 10}}>发起人：{model.applicantRoles.map((e: any)=>e.roleName).join(',')}</p>
  //                     <Table
  //                     bordered
  //                     dataSource={model.nodes || []}
  //                     pagination={false}
  //                     summary={() => {
  //                       if (model.carbonCopies && model.carbonCopies.length > 0) {
  //                         return (
  //                           <Table.Summary.Row>
  //                           <Table.Summary.Cell index={0}>
  //                             <div style={{ textAlign: 'center' }}> 抄送</div>
  //                           </Table.Summary.Cell>
  //                           <Table.Summary.Cell index={1}>
  //                             <div style={{ textAlign: 'center' }}>
  //                               {model.carbonCopies.map((item: any) => item.roleName).join(',')}
  //                             </div>
  //                           </Table.Summary.Cell>
  //                           <Table.Summary.Cell index={2}>
  //                             <div style={{ textAlign: 'center' }}> - -</div>
  //                           </Table.Summary.Cell>
  //                         </Table.Summary.Row>
  //                         );
  //                       }
  //                     }
  //                     }
  //                     columns={[
  //                       {
  //                         dataIndex: 'orderNumber',
  //                         align: 'center',
  //                         title: '审批节点',
  //                       },
  //                       {
  //                         dataIndex: 'roles',
  //                         align: 'center',
  //                         title: '审批人',
  //                         render: (roles) => {
  //                           if (roles && roles.length > 0) {
  //                             return roles.map((item: any) => item.roleName).join(',');
  //                           }
  //                           return '- -';
  //                         },
  //                       },
  //                       {
  //                         dataIndex: 'signType',
  //                         align: 'center',
  //                         title: '审批方式',
  //                         render: (val?: 0 | 1 | 2) => {
  //                           if (val === undefined) {
  //                             return '- -';
  //                           }
  //                           const map = {
  //                             0: '单人',
  //                             1: '或签',
  //                             2: '会签',
  //                           };
  //                           return map[val];
  //                         },
  //                       },
  //                     ]}></Table>
  //                     </div>
  //                   );
  //                 })}
  //               </div>)
  //           })}
  //         </div>
  //       </Form.Item>
  //     </Form>
  //   </Row>
  // );
}
