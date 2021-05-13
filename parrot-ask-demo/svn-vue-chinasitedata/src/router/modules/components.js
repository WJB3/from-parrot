/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/Basemodes',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Basemodes',
  meta: {
    title: '基础建模',
    icon: 'component'
  },
  children: [
    {
      path: 'tinymce',
      component: () => import('@/views/basemodes/tinymce'),
      name: 'TinymceDemo',
      meta: { title: '人员基本信息' }
    },
    {
      path: 'markdown',
      component: () => import('@/views/basemodes/markdown'),
      name: 'markdown',
      meta: { title: '角色基本信息' }
    },
    {
      path: 'json-editor',
      component: () => import('@/views/basemodes/json-editor'),
      name: 'json-editor',
      meta: { title: '工厂基本信息' }
    },
    {
      path: 'split-pane',
      component: () => import('@/views/basemodes/split-pane'),
      name: 'split-pane',
      meta: { title: '车间基本信息' }
    },
    {
      path: 'avatar-upload',
      component: () => import('@/views/basemodes/avatar-upload'),
      name: 'AvatarUploadDemo',
      meta: { title: '班次设定' }
    },
    {
      path: 'dropzone',
      component: () => import('@/views/basemodes/dropzone'),
      name: 'DropzoneDemo',
      meta: { title: '产线信息管理' }
    },
    {
      path: 'sticky',
      component: () => import('@/views/basemodes/sticky'),
      name: 'StickyDemo',
      meta: { title: '工位信息管理' }
    },
    {
      path: 'count-to',
      component: () => import('@/views/basemodes/count-to'),
      name: 'CountToDemo',
      meta: { title: '技能信息管理' }
    },
    {
      path: 'mixin',
      component: () => import('@/views/basemodes/mixin'),
      name: 'ComponentMixinDemo',
      meta: { title: '生产班组管理' }
    },
    {
      path: 'back-to-top',
      component: () => import('@/views/basemodes/back-to-top'),
      name: 'BackToTopDemo',
      meta: { title: '工艺信息管理' }
    },
    {
      path: 'drag-dialog',
      component: () => import('@/views/basemodes/drag-dialog'),
      name: 'DragDialogDemo',
      meta: { title: '工厂日历管理' }
    }
  ]
}

export default componentsRouter
