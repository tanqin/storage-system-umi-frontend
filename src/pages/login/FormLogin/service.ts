import { request } from 'umi'

export interface LoginParams {
  username: string
  password: string
  remember: boolean
}

export async function fakeRegister(params: LoginParams) {
  return request('/api/login', {
    method: 'POST',
    data: params
  })
}
