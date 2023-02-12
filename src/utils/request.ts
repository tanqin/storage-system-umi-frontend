/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import { extend } from 'umi-request'
import { notification, Modal } from 'antd'
import { getToken, removeToken } from './auth'
import sysConfig from './sysConfig'
import { history } from 'umi'

const codeMessage = {
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
type CodeMessageKey = keyof typeof codeMessage
/**
 * 异常处理程序
 */
const errorHandler = (error: any) => {
  const { response = {} } = error

  const responseStatus = response?.code as CodeMessageKey
  const errorText = codeMessage[responseStatus] || response?.message
  const { code, url } = response
  if (code === 401) {
    // 无权限，交给相应拦截器处理
    return
  }
  notification.error({
    message: `请求错误 ${code}: ${url}`,
    description: errorText
  })
  if (error) {
    removeToken()
  }
  // environment should not be used
  if (code === 403) {
    history.push('/403')
    return
  }
  if (code <= 504 && code >= 500) {
    history.push('/500')
    return
  }
  if (code >= 404 && code < 422) {
    history.push('/404')
  }
}

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  timeout: 10000,
  credentials: 'include' // 默认请求是否带上cookie,
})

//请求拦截
request.interceptors.request.use((url, options) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json;charset=utf-8'
  }
  const env = process.env.NODE_ENV as 'development' | 'production'
  const baseurl = sysConfig[env].baseUrl + url
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
  if (response.url.indexOf('personnel/exportById') !== -1) {
    const res = await response.clone().text()
    // const blob = new Blob([res],{type: 'application/arrayBuffer'});
  } else {
    const res = await response.clone().json()
    const { code, path, msg, status } = res
    // const errorText = codeMessage[code || status ] || message;
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
      // 待开放
      // notification.error({
      //   message: `请求错误 ${code || status }: ${path}`,
      //   description: errorText,
      // });
      // return Promise.reject('error');
    }
  }
  return response
})

export default request
