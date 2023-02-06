import { request } from 'umi'

export interface StateType {
  status?: 'ok' | 'error'
  currentAuthority?: 'user' | 'guest' | 'admin'
}

export interface RegisterParams {
  mail: string
  password: string
  confirm: string
  mobile: string
  captcha: string
  prefix: string
}

export async function fakeRegister(params: RegisterParams) {
  return request('/api/register', {
    method: 'POST',
    data: params
  })
}
