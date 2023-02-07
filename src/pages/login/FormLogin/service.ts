import { request } from 'umi'

export interface LoginParams {
  username: string
  password: string
}
const baseURL = 'http://localhost:8080'
export async function loginAPI(params: LoginParams) {
  return request(baseURL + '/user/login', {
    method: 'POST',
    data: params
  })
}
