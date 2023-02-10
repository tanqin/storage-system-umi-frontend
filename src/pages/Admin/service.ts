import { request } from 'umi'

export interface PageQueryParams {
  pageNum?: number
  pageSize?: number
  params?: {
    roleId?: number
    sex?: number
    queryString?: string
  }
}

export interface User {
  id: number
  username: string
  nickname: string
  age: number
  sex: number
  phone: string
  roleId: number
}

const baseURL = 'http://localhost:8080'

export async function getUserListAPI(params: PageQueryParams) {
  return request(baseURL + '/user/pageList', {
    method: 'POST',
    data: params
  })
}
