import { defineConfig } from 'umi'
import routes from './routes'
export default defineConfig({
  dva: {},
  nodeModulesTransform: {
    type: 'none'
  },
  fastRefresh: {},
  layout: {
    // 所有配置项：https://procomponents.ant.design/components/layout#prolayout
    title: '仓库管理系统',
    logo: 'logo.png',
    locale: 'zh-CN',
    contentStyle: { padding: '20px' }, // layout 的内容区 style
    siderWidth: 190
  },
  routes,
  request: {
    dataField: ''
  }
})
