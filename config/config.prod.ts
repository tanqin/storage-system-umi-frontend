import { defineConfig } from 'umi'
export default defineConfig({
  define: {
    'process.env': {
      NODE_ENV: 'production',
      baseUrl: '生成环境地址'
    }
  }
})
