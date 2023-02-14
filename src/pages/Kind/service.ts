import request from '@/utils/request'
import { ResultType } from '../User/Register/service'

export interface IKind {
  id?: number
  storageId?: number
  name?: string
  remark?: string
  isValid?: boolean
}

export async function getKindListAPI<P>(params: IPageQuery<P>) {
  return request<ResultType<IKind[]>>('/kind/list', {
    method: 'POST',
    data: params
  })
}

export async function addOrEditKindAPI(kind: IKind) {
  return request<ResultType>('/kind/saveOrUpdate', {
    method: 'Post',
    data: kind
  })
}

export async function deleteKindAPI(id: number) {
  return request<ResultType>(`/kind/delete/${id}`, {
    method: 'DELETE'
  })
}
