import request from '@/utils/request'
import { ResultType } from '../User/Register/service'

export interface IGoods {
  id?: number
  storageId?: number
  kindId?: number
  name?: string
  remark?: string
  imgUrl?: string
  price?: number
  count?: number
  isValid?: boolean
}

export async function getGoodsListAPI<P>(params: IPageQuery<P>) {
  return request<ResultType<IGoods[]>>('/goods/list', {
    method: 'POST',
    data: params
  })
}

export async function addOrEditGoodsAPI(goods: IGoods) {
  return request<ResultType>('/goods/saveOrUpdate', {
    method: 'Post',
    data: goods
  })
}

export async function deleteGoodsAPI(id: number) {
  return request<ResultType>(`/goods/delete/${id}`, {
    method: 'DELETE'
  })
}
