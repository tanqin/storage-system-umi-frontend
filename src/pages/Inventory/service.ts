import request from '@/utils/request'
import { ResultType } from '../User/Register/service'

export interface IInventory {
  id: number
  itemNumber: string
  itemName: string
  quantity: number
  unit: string
  costPrice: number
  sellingPrice: number
  status: number
  location: string
  lastUpdated: Date
  createdAt: Date
}

export async function getInventoryListAPI<P>(params: IPageQuery<P>) {
  return request<ResultType<IInventory[]>>('/inventory/list', {
    method: 'POST',
    data: params
  })
}

export async function addOrEditInventoryAPI(inventory: IInventory) {
  return request<ResultType>('/inventory/saveOrUpdate', {
    method: 'Post',
    data: inventory
  })
}

export async function deleteInventoryAPI(id: number) {
  return request<ResultType>(`/inventory/delete/${id}`, {
    method: 'DELETE'
  })
}
