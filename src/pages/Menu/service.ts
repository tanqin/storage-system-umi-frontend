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
