import { User } from '@/pages/Account/service'
import request, { CodeMessageKey } from '@/utils/request'

export interface ResultType<T = null> {
  code: CodeMessageKey
  message: string
  total?: number | null
  data?: T
}

export async function registerAPI<T>(params: User) {
  return request<ResultType<T>>('/user/register', {
    method: 'POST',
    data: params
  })
}
