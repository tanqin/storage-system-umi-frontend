import request from '@/utils/request'
import { ResultType } from './User/Register/service'

export async function getUserInfoAPI<T>() {
  return request<ResultType<T>>('/user/info', {
    method: 'GET'
  })
}
