import request from '@/utils/request'
export interface LoginParams {
  username: string
  password: string
}
export async function loginAPI(params: LoginParams) {
  return request('/user/login', {
    method: 'POST',
    data: params
  })
}
