/**
 * request 网络请求工具
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
  if (!error.response) {
    const code = 503
    notification.error({
      message: `${code} : ${error.request.url}`,
      description: '请求错误: ' + codeMessage[code]
    })
    return
  }
  const { status } = error.response
  const code = status as CodeMessageKey
  if (code === 403) {
    history.push('/403')
  } else if (code <= 504 && code >= 500) {
    history.push('/500')
  } else if (code >= 404 && code < 422) {
    history.push('/404')
  }
}

/**
 * 配置请求时的默认参数
 */
const request = extend({
  errorHandler,
  timeout: 60000,
  credentials: 'include' // 默认请求是否带上 cookie
})

//请求拦截
request.interceptors.request.use((url, options) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json;charset=utf-8'
  }

  const baseurl = process.env.baseUrl + url
  const optionsHeaders = options.headers as { [key: string]: string }

  if (token) {
    optionsHeaders.Authorization = token
    return {
      url: baseurl,
      options: options,
      headers: { ...headers }
    }
  }
  delete optionsHeaders.Authorization
  return {
    url: baseurl,
    options,
    headers: { ...headers }
  }
})

//响应拦截
request.interceptors.response.use(async (response, options) => {
  const status = response.status as CodeMessageKey
  if (response.url.indexOf('personnel/exportById') !== -1) {
    // const res = await response.clone().text()
    // const blob = new Blob([res],{type: 'application/arrayBuffer'});
  } else {
    const res: ResultType = await response.clone().json()
    const { code, message } = res
    const errorText = codeMessage[code || status] || message
    // debugger
    if (code === 401) {
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
    } else if (code !== 200) {
      notification.error({
        message: `${code || status} : ${response.url}`,
        description: '请求错误: ' + errorText
      })
    }
  }
  return response
})

export default request
