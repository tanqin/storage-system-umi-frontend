import { defineConfig } from 'umi'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none'
  },
  fastRefresh: {},
  layout: {
    name: '仓库管理系统',
    logo: 'logo.png',
    locale: true
  },
  routes: [
    {
      path: '/login',
      component: '@/pages/login',
      layout: false
    },
    {
      path: '/',
      component: '@/pages'
    },
    {
      component: '@/404'
    }
  ]
})
