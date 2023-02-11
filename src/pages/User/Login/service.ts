import request from '@/utils/request'
import { ResultType } from '../Register/service'
export interface LoginParams {
  username: string
  password: string
}
export async function loginAPI<T>(params: LoginParams) {
  return request<ResultType<T>>('/user/login', {
    method: 'POST',
    data: params
  })
}
