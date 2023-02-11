import { User } from '@/pages/Admin/service'
import request from '@/utils/request'

export interface ResultType {
  code: number
  message: string
  total?: number | null
  data?: object | null
}

export async function registerAPI<T>(params: User) {
  return request<T>('/user/register', {
    method: 'POST',
    data: params
  })
}
