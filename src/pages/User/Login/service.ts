import { User } from '@/pages/Account/service'
import request from '@/utils/request'
import { ResultType } from '../Register/service'

export async function loginAPI<T>(params: User) {
  return request<ResultType<T>>('/user/login', {
    method: 'POST',
    data: params
  })
}
