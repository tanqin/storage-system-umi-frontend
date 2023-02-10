import { User } from '@/pages/Admin/service'
import { request } from 'umi'

export interface ResultType {
  code: number
  message: string
  total?: number | null
  data?: object | null
}

const baseURL = 'http://localhost:8080'

export async function registerAPI(params: User) {
  return request(baseURL + '/user/register', {
    method: 'POST',
    data: params
  })
}
