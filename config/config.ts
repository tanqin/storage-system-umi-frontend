import { defineConfig } from 'umi'
import routes from './routes'
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
  routes,
  request: {
    dataField: ''
  }
})
