/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/systems',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'systems',
  meta: {
    title: '系统管理',
    icon: 'table'
  },
  children: [
    {
      path: 'systemManager',
      component: () => import('@/views/systemManagers/dynamic-table/index'),
      name: 'SystemManager',
      meta: { title: '用户管理' }
    },
    {
      path: 'systemRoles',
      component: () => import('@/views/systemManagers/drag-table'),
      name: 'SystemRoles',
      meta: { title: '角色管理' }
    },
    {
      path: 'systemMenu',
      component: () => import('@/views/systemManagers/inline-edit-table'),
      name: 'SystemMenu',
      meta: { title: '菜单管理' }
    },
    {
      path: 'systemMenuBtn',
      component: () => import('@/views/systemManagers/complex-table'),
      name: 'SystemMenuBtn',
      meta: { title: '按钮权限管理' }
    }
  ]
}
export default tableRouter
