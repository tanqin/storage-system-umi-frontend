import request from '@/utils/request'
import { ResultType } from '../User/Register/service'

export interface IPageQuery<T = {}> {
  pageNum?: number
  pageSize?: number
  params?: T
}

export interface IStorage {
  id?: number
  name?: string
  remark?: string
  dataCount?: number
  goodsCount?: number
  isValid?: boolean
}

export async function getStorageListAPI<P>(params: IPageQuery<P>) {
  return request<ResultType<IStorage[]>>('/storage/list', {
    method: 'POST',
    data: params
  })
}

export async function addOrEditStorageAPI(storage: IStorage) {
  return request<ResultType>('/storage/saveOrUpdate', {
    method: 'Post',
    data: storage
  })
}

export async function deleteStorageAPI(id: number) {
  return request<ResultType>(`/storage/delete/${id}`, {
    method: 'DELETE'
  })
}
