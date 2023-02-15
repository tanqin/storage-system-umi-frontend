import request from '@/utils/request'
import { ResultType } from '../User/Register/service'

export type User = {
  username: string
} & Partial<{
  id: number
  password: string
  nickname: string
  age: number
  sex: 0 | 1 | 2
  phone: string
  roleId: 0 | 1 | 2
  isValid: boolean
  rememberMe: boolean
}>

/**
 * 获取用户列表（含分页、搜索）
 * @param params 分页查询参数
 * @returns
 */
export async function getUserListAPI<P>(params: IPageQuery<P>) {
  return request<ResultType<User[]>>('/user/pageList', {
    method: 'POST',
    data: params
  })
}

/**
 * 编辑用户信息
 * @param user 用户信息
 * @returns
 */
export async function editUserAPI(user: User) {
  return request<ResultType>('/user/update', {
    method: 'PUT',
    data: user
  })
}

/**
 * 根据 id 删除用户
 * @param id 用户 id
 * @returns
 */
export async function deleteUserAPI(id: number) {
  return request<ResultType>(`/user/delete/${id}`, {
    method: 'DELETE'
  })
}
