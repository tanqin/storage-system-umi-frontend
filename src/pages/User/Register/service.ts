import { User } from '@/pages/Admin/service'
import request from '@/utils/request'

export interface ResultType<T> {
  code: number
  message: string
  total?: number | null
  data?: T | null
}

export async function registerAPI<T>(params: User) {
  return request<ResultType<T>>('/user/register', {
    method: 'POST',
    data: params
  })
}
