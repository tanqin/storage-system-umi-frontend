import { defineConfig } from 'umi'
import routes from './routes'
export default defineConfig({
  define: {
    'process.env': {
      NODE_ENV: 'development',
      baseUrl: 'http://localhost:8080', // 后端地址
      // baseUrl: 'http://localhost:8000', // mock 地址
      iconScriptUrl: '//at.alicdn.com/t/c/font_3892069_mulu0r67sx8.js' // Ant Design iconfont 图标库
    }
  },
  favicon: '/favicon.svg',
  dva: {
    immer: true, // 启用 immer 以方便修改 reducer
    hmr: true // 启用 dva model 的热更新
  },
  nodeModulesTransform: {
    type: 'none'
  },
  // mfsu: {},
  // webpack5: {},
  fastRefresh: {},
  layout: {
    // 所有配置项：https://procomponents.ant.design/components/layout#prolayout
    title: '仓库管理系统',
    logo: '/favicon.svg',
    locale: 'zh-CN',
    contentStyle: { padding: '20px', height: 'calc(100vh - 48px - 40px)' }, // layout 的内容区 style
    siderWidth: 194
  },
  routes,
  request: {
    dataField: ''
  }
})
