import { request } from 'umi'

export interface ResultType {
  code: number
  message: string
  total?: number | null
  data?: object | null
}

export interface RegisterParams {
  username: string
  password: string
  nickname?: string
  age?: number
  sex?: number
  phone?: string
}

const baseURL = 'http://localhost:8080'

export async function registerAPI(params: RegisterParams) {
  return request(baseURL + '/user/register', {
    method: 'POST',
    data: params
  })
}
