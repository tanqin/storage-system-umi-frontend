import request from '@/utils/request'

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

export async function getUserListAPI(params: PageQueryParams) {
  return request('/user/pageList', {
    method: 'POST',
    data: params
  })
}

export async function editUserAPI(user: User) {
  return request('/user/update', {
    method: 'PUT',
    data: user
  })
}

export async function deleteUserAPI<R>(id: number) {
  return request<R>(`/user/delete/${id}`, {
    method: 'DELETE'
  })
}
