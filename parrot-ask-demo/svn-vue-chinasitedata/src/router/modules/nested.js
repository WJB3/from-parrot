/** 生产管理 **/

import Layout from '@/layout'

const nestedRouter = {
  path: '/nested',
  component: Layout,
  redirect: '/nested/menu1/menu1-1',
  name: 'Nested',
  meta: {
    title: '生产管理',
    icon: 'nested'
  },
  children: [
    {
      path: 'inciseWork',
      component: () => import('@/views/nested/menu1/index'), // Parent router-view
      name: 'inciseWork',
      meta: { title: '切割车间' },
      redirect: '/nested/menu1/menu1-1',
      children: [
        {
          path: 'workOrder',
          component: () => import('@/views/nested/menu1/menu1-1'),
          name: 'Menu1-1',
          meta: { title: '预处理工单' }
        },
        {
          path: 'workOrderFinalls',
          component: () => import('@/views/nested/menu1/menu1-3'),
          name: 'workOrderFinalls',
          meta: { title: '预处理完检工单' }
        }
      ]
    }
  ]
}

export default nestedRouter
