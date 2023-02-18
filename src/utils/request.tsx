/**
 * request 网络请求工具。参考：https://blog.csdn.net/fsfsdgsdg/article/details/125245983
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import { extend } from 'umi-request'
import { notification, Modal } from 'antd'
import { getToken, removeToken } from './auth'
import { history } from 'umi'
import { ResultType } from '@/pages/User/Register/service'
import type { ResponseError } from 'umi-request'

export const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

export type CodeMessageKey = keyof typeof codeMessage

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error
  const code = response.status as CodeMessageKey
  if (response && code) {
    // if (code === 404) {
    //   history.push('/404')
    // }
    const errorText = codeMessage[code] || response.statusText
    const { status, url } = response
    notification.error({
      message: `请求 url: ${url}`,
      description: (
        <>
          <div> 状态码：{status}</div> <div>{errorText}</div>
        </>
      )
    })
  } else if (!response) {
    notification.error({
      message: '网络异常',
      description: '网络异常，无法连接服务器'
    })
  }
}

// 配置请求时的默认参数。配置文档：https://github.com/umijs/umi-request/blob/master/README_zh-CN.md
const request = extend({
  prefix: process.env.baseUrl, // 统一的请求前缀
  timeout: 60000,
  credentials: 'include', // 默认请求是否带上 cookie
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    Authorization: getToken() || ''
  },
  errorHandler
})

//请求拦截
request.interceptors.request.use((url, options) => {
  return {
    options: {
      ...options,
      interceptors: true
    }
  }
})

//响应拦截
request.interceptors.response.use(async (response) => {
  const status = response.status as CodeMessageKey
  const res: ResultType = await response.clone().json()
  const errorText = codeMessage[status] || res.message
  // debugger
  if (status !== 200) {
    switch (status) {
      case 401:
        Modal.confirm({
          title: '系统提示',
          content: '登录状态已过期，您可以继续留在该页面，或者重新登录？',
          okText: '重新登录',
          cancelText: '取消',
          onOk: () => {
            removeToken()
            history.push('/user/login')
          }
        })
        break

      default:
        // 仅在开发环境下显示错误通知，主要是为了方便开发环境查看错误原因
        if (process.env.NODE_ENV === 'development') {
          notification.error({
            message: `请求 url: ${response.url}`,
            description: (
              <>
                <div> 状态码：{status}</div> <div>{errorText}</div>
              </>
            )
          })
        }
        break
    }
  }
  return response
})

export default request
