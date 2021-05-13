import React, { useState, useEffect, FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Menu, Dropdown, Layout } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'
import Breadcrumb from '@/components/common/breadcrumb'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import style from './Header.module.less'
import { fullScreen,exitScreen } from '@/utils/screen';

interface Props extends ReduxProps { }

const Header: FC<Props> = ({
  storeData: { theme, userInfo },
  setStoreData
}) => {
  const history = useHistory()
  const { userName = '-' } = userInfo
  const firstWord = userName.slice(0, 1)
  const [collapsed, setCollapsed] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const logout = async () => {
    localStorage.setItem("MENU",null);
    localStorage.setItem("TOKEN",null);
    localStorage.setItem("USERNAME",null);
    history.replace({ pathname: '/login' })
  }

  const changeTheme = (themes: string) => {
    setStoreData('SET_THEME', themes)
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>
        <span>退出登录</span>
      </Menu.Item>
    </Menu>
  )

  const changeMenu = (
    <Menu>
      <Menu.Item onClick={() => changeTheme('')}>
        <span>暗黑主题</span>
      </Menu.Item>
      <Menu.Item onClick={() => changeTheme('default')}>
        <span>亮白主题</span>
      </Menu.Item>
    </Menu>
  )

  const toggle = (): void => {
    setCollapsed(!collapsed)
    setStoreData('SET_COLLAPSED', !collapsed)
  }

  // 更换主题
  useEffect(() => {
    if (theme === 'default') {
      const script = document.createElement('script')
      script.id = 'themeJs'
      script.src = '/less.min.js'
      document.body.appendChild(script)

      setTimeout(() => {
        const themeStyle = document.getElementById('less:color')
        if (themeStyle) localStorage.setItem('themeStyle', themeStyle.innerText)
      }, 500)
    } else {
      const themeJs = document.getElementById('themeJs')
      const themeStyle = document.getElementById('less:color')
      if (themeJs) themeJs.remove()
      if (themeStyle) themeStyle.remove()
      localStorage.removeItem('themeStyle')
    }
  }, [theme])

  const iconStyle={
    fontSize:24
  }

  const handleChangeScreen=()=>{
    if(fullscreen){
      exitScreen()
      setFullscreen(false)
    }else{
      fullScreen()
      setFullscreen(true)
    }
  }

  return (
    <Layout.Header className={style.header}  style={collapsed?{width:`calc(100% - 80px)`}:{width:`calc(100% - 240px)`}}>
      <div>
        <div className={style.toggleMenu} onClick={toggle}>
          {collapsed ? (
            <MenuUnfoldOutlined className={style.trigger} />
          ) : (
            <MenuFoldOutlined className={style.trigger} />
          )}
        </div>
     
      </div>

      <div className={style.headerRight}>

        <div className={style.fullScreen} onClick={handleChangeScreen}>
          {
            fullscreen ? <FullscreenExitOutlined style={iconStyle}/> :<FullscreenOutlined style={iconStyle}/>
          }
        </div>

        {/* <Dropdown overlay={changeMenu}>
          <div title="更换主题" className="webTheme" />
        </Dropdown> */}
        <Dropdown className={`fr ${style.content}`} overlay={menu}>
          <span className={style.user}>
            <span className="avart">{firstWord}</span>
            <span>{userName}</span>
          </span>
        </Dropdown>
      </div>

    </Layout.Header>
  )
}
export default connect(
  (state) => state,
  actions
)(Header)
