import request from '@/utils/request'
import { ResultType } from '../User/Register/service'

export interface ILog {
  id?: number
  goodsId?: number
  storageId?: number
  kindId?: number
  type: number
  operatorId?: number
  remark?: string
  createTime?: string
}

export async function getLogListAPI<P>(params: IPageQuery<P>) {
  return request<ResultType<ILog[]>>('/log/list', {
    method: 'POST',
    data: params
  })
}

export async function deleteLogAPI(id: number) {
  return request<ResultType>(`/log/delete/${id}`, {
    method: 'DELETE'
  })
}
