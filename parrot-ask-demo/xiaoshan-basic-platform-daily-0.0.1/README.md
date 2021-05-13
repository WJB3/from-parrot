## types

- /dto：所有请求参数类型申明
- /model：数据模型类型申明
- modal.d.ts 弹窗类型申明
- response.d.ts 接口返回类型申明

## src

### /api

- 接口定义
- request.ts 因为萧山基础平台和 iot 平台后端返回没有统一，定义了 2 个 axios 实例，instance 为萧山基础平台请求实例，iotInstance 为 iot 请求实例

### /components

- importModal index.tsx 为数据导入组件，Result.ts 为导入结果展示组件
- selectMember 人员选择空控件
- BuildingSiderbar.tsx 建筑空间侧边栏控件
- DictionarySidebar.tsx 字典侧边栏控件
- IconFont.tsx 自定义 icon 控件
- OneLineText.tsx 单行文案控件，可以通过点击切换是否全部展示效果
- OrganizationSidebar.tsx 组织架构侧边栏控件
- PageBreadcrumb.tsx 页面顶部面包屑控件
- PageTab.tsx 页面顶部 tab 控件
- PrivateComponent.tsx,PrivateRoute.tsx 鉴权组件和鉴权路由
- SectionSidebar.tsx 学期侧边栏控件
- UploadFiles.tsx 上传控件
- VerifyCode.tsx 验证码控件

### /hook

- useDictionary.tsx 字典渲染工具
- useDownload.tsx 下载工具

### /store

- 全局 state 和 action

### /views

- app 内置应用
- login 登录页面
- workspace 工作台
- common 其他页面

### 路由匹配

- 路由入口 src/App.tsx
  - /login
  - /account/password/forget
  - /account/active
  - Layout 控件再次匹配
- Layout.tsx

  - /workspace
  - /app/:id/:pageId 再次匹配
  - /app/:id 再次匹配
  - /account/setting
  - /account/bindwechat
  - 404

- /app/:id/:pageId 以及/app/:id /src/views/app/index.tsx 匹配
  - 通过 id 和 pageId 匹配到各个应用
