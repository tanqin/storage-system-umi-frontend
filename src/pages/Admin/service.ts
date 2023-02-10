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
  password?: string
  nickname: string
  age: number
  sex: number | null | undefined
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

export async function editUserAPI(user: User) {
  return request(baseURL + '/user/update', {
    method: 'PUT',
    data: user
  })
}

export async function deleteUserAPI<R>(id: number) {
  return request<R>(baseURL + `/user/delete/${id}`, {
    method: 'DELETE'
  })
}
