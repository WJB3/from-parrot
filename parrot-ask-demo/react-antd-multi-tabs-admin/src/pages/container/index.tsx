import React, { FC, useState, useEffect, useRef, Component } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import MenuView from '@/components/common/menu'
import classNames from 'classnames'
import { Layout, BackTop } from 'antd'
import { getKeyName, isAuthorized } from '@/assets/js/publicFunc'
import Header from '@/components/common/header'
import TabPanes from '@/components/common/tabPanes'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import styles from './Home.module.less'

const noNewTab = ['/login'] // 不需要新建 tab的页面 
 

interface Props extends ReduxProps {}

interface PanesItemProps {
  title: string;
  content: Component;
  key: string;
  closable: boolean;
  path: string;
}

const Home: FC<Props> = (props) => {
  const [tabActiveKey, setTabActiveKey] = useState<string>('home')
  const [panesItem, setPanesItem] = useState<PanesItemProps>({
    title: '',
    content: null,
    key: '',
    closable: false,
    path: ''
  })
  const pathRef: RefType = useRef<string>('')

  const history = useHistory()
  const { pathname, search } = useLocation() 

  const {
    storeData: { collapsed, userInfo },
    setStoreData
  } = props
  const { token } = userInfo

  useEffect(() => { 
    
    setStoreData('SET_COLLAPSED', document.body.clientWidth <= 1366)

    // 未登录
    if (!localStorage.getItem('TOKEN') && pathname !== '/login') {
   
      history.replace({ pathname: '/login' })
      return
    }

    if (localStorage.getItem('TOKEN') && pathname === '/print') {
      history.push({ pathname: '/print' })
      return
    }

    const { tabKey, title, component: Content } = getKeyName(pathname)
    // 新tab已存在或不需要新建tab，return
    if (pathname === pathRef.current || noNewTab.includes(pathname)) {
      setTabActiveKey(tabKey)
      return
    }

    // 记录新的路径，用于下次更新比较
    const newPath = search ? pathname + search : pathname
    pathRef.current = newPath
    setPanesItem({
      title,
      content: Content,
      key: tabKey,
      closable: tabKey !== 'home',
      path: newPath
    })
    setTabActiveKey(tabKey)
  }, [history, pathname, search, setStoreData, token])

  useEffect(()=>{
    console.log("collapsed",collapsed)

  },[collapsed])

  return (
    <Layout
      className={styles.container}
      onContextMenu={(e) => e.preventDefault()}
      style={{ display: (pathname.includes('/login') || pathname.includes('/print')) ? 'none' : 'flex' }}
    >
      <MenuView />
      <Layout
        className={classNames(styles.content, {
          [styles.collapsed]: collapsed
        })}
        style={collapsed?{width:`calc(100% - 80px)`}:{width:`calc(100% - 240px)`}}
      >
        <Header />
        <Layout.Content >
          <TabPanes
            defaultActiveKey="home"
            panesItem={panesItem}
            tabActiveKey={tabActiveKey}
          />
        </Layout.Content>
      </Layout>
      <BackTop visibilityHeight={1080} />
    </Layout>
  )
}

export default connect(
  (state) => state,
  actions
)(Home)
