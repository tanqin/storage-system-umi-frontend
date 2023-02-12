import request from '@/utils/request'
import { ResultType } from '../User/Register/service'

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

export async function getUserListAPI<T>(params: PageQueryParams) {
  return request<ResultType<T>>('/user/pageList', {
    method: 'POST',
    data: params
  })
}

export async function editUserAPI<T>(user: User) {
  return request<ResultType<T>>('/user/update', {
    method: 'PUT',
    data: user
  })
}

export async function deleteUserAPI<T>(id: number) {
  return request<ResultType<T>>(`/user/delete/${id}`, {
    method: 'DELETE'
  })
}
