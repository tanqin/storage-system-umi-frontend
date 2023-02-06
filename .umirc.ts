import { defineConfig } from 'umi'
export default defineConfig({
  dva: {},
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
      name: '登录页',
      path: '/login',
      component: './Login',
      layout: false
    },
    {
      name: '注册页',
      path: '/register',
      component: './Register',
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
