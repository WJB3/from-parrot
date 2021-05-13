/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/MaterDetails',
  component: Layout,
  redirect: 'noRedirect',
  name: 'MaterDetails',
  meta: {
    title: '物料管理',
    icon: 'el-icon-film'
  },
  children: [
    {
      path: 'materbase',
      component: () => import('@/views/materials/materbasemodel'),
      name: 'materbase',
      meta: { title: '物料基础信息管理' }
    },
    {
      path: 'proManager',
      component: () => import('@/views/materials/proManager'),
      name: 'proManager',
      meta: { title: '产品BOM管理' }
    },
    {
      path: 'examation',
      component: () => import('@/views/materials/examation'),
      name: 'examation',
      meta: { title: '齐套性检查（阻焊合拢）' }
    },
    {
      path: 'inspect ',
      component: () => import('@/views/materials/inspect'),
      name: 'inspect ',
      meta: { title: '齐套性检查' }
    },
    {
      path: 'inspects',
      component: () => import('@/views/materials/inspects'),
      name: 'inspects',
      meta: { title: '齐套性检查（切割）' }
    },
    //外网
    {
      path: 'link',
      component: () => import('@/views/materials/link'),
      name: 'link',
      meta: { title: '物流实时状态监控' }
    },
    {
      path: 'searchProduct',
      component: () => import('@/views/materials/searchProduct'),
      name: 'searchProduct',
      meta: { title: '在制品查询' }
    },
    {
        path: 'logistics',
        component: () => import('@/views/materials/logistics'),
        name: 'logistics',
        meta: { title: '物流追溯' }
      },
      {
        path: 'logisTatus',
        component: () => import('@/views/materials/logisTatus'),
        name: 'logisTatus',
        meta: { title: '物料状态查询' }
      }
  ]
}

export default componentsRouter
