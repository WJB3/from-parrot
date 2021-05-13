import React, { FC, useEffect, useState, useLayoutEffect } from 'react'
import { Statistic, Card, Row, Col, Typography } from 'antd'
import CustomTable from '@/components/CustomTable';
import WhiteSpace from '@/components/WhiteSpace';
import NoticeApi from '@/api/notice'
import EmailApi from '@/api/email'
import Api from '@/api/auth/useInfo'

const { Title, Paragraph, Text, Link } = Typography;
 
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30 // Moment is also OK

const Home: FC = () => {

  const [user, setUser] = useState<any>({});

  const [data1,setData1]=useState([]);

  const [data2,setData2]=useState([]);

  useLayoutEffect(() => {
    Api.getInfo().then(res => { 
      localStorage.setItem("CURRENTUSER",res.username)
      setUser(res||{})
    })
  }, []); 

  useEffect(()=>{
    NoticeApi.getList({page:1,size:15}).then(res=>{
      console.log('res', res)
      setData1(res.records);
    })
  },[]);

  useEffect(()=>{
    EmailApi.getReceive({page:1,size:15}).then(res=>{
      console.log('res', res)
      setData2(res.records);
    })
  },[]);

  const columns1 = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render:(current,record)=>{
        return <a>{current}</a>
      }
    }
  ];

  const columns2 = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '发送时间',
      dataIndex: 'fileType',
      key: 'fileType',
    }
  ]

  return (
    <div className="home">
      <Row gutter={16}>
        <Col span={24}>
          <Card>
            <Paragraph>
              欢迎 <Text strong>{user.username}</Text> 登录 <Text strong>东风标致MEC素材广场</Text>
            </Paragraph>
            <Paragraph>
              当前登录时间 ：<Text strong>{user.lastLoginTime}</Text>      登录IP：<Text strong>{user.lastLoginIp}</Text>
            </Paragraph>
            <Paragraph>
              登录总次数 ：<Text strong>{user.loginCount}</Text>
            </Paragraph>
            <Paragraph>
              网站运维:<Text strong>0551-63354088 </Text>
            </Paragraph>
          </Card>
        </Col>
      </Row>
      <WhiteSpace height={10} />
      <Row gutter={16}>
        <Col span={12}>
          <Card title="资源公告">
            <CustomTable
              dataSource={data1}
              columns={columns1}
              renderRight={false}
              showTableTop={false}
              showWhiteSpace={false} 
              title={false}
              noselection
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="站内信">
            <CustomTable 
                dataSource={data2}
                columns={columns2}
                renderRight={false}
                showTableTop={false}
                showWhiteSpace={false}
                title={false}
                noselection
                pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home
