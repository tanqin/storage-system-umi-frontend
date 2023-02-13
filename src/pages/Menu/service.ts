import request from '@/utils/request'
import { ResultType } from '../User/Register/service'
import { IRoute } from 'umi'
import { PageQueryParams } from '../Account/service'

export async function getMenuAuthAPI() {
  return request<ResultType<IRoute[]>>('/menu/auth', {
    method: 'GET'
  })
}
export async function getMenuListAPI(params: PageQueryParams) {
  return request<ResultType<IRoute[]>>('/menu/list', {
    method: 'POST',
    data: params
  })
}

export async function addOrEditMenuAPI(params: IRoute) {
  return request<ResultType>('/menu/saveOrUpdate', {
    method: 'POST',
    data: params
  })
}

export async function deleteMenuAPI(id: number) {
  return request<ResultType>(`/menu/delete/${id}`, {
    method: 'DELETE'
  })
}
