import request from '@/utils/request'
import { ResultType } from '../User/Register/service'

export interface IKind {
  id?: number
  name?: string
  remark?: string
  isValid?: boolean
}

/**
 * 种类分页查询
 * @param params 分页参数
 * @returns
 */
export async function getKindListAPI<P>(params: IPageQuery<P>) {
  return request<ResultType<IKind[]>>('/kind/list', {
    method: 'POST',
    data: params
  })
}

/**
 * 种类所有数据（形式如：[{value: 1, label: '食品类'}]）
 * @returns
 */
export async function getKindAllListAPI() {
  return request<ResultType<SelectType[]>>('/kind/all', {
    method: 'GET'
  })
}

/**
 * 新增或编辑种类数据
 * @param kind 种类实体
 * @returns
 */
export async function addOrEditKindAPI(kind: IKind) {
  return request<ResultType>('/kind/saveOrUpdate', {
    method: 'Post',
    data: kind
  })
}

/**
 * 根据 id 删除种类
 * @param id 种类 id
 * @returns
 */
export async function deleteKindAPI(id: number) {
  return request<ResultType>(`/kind/delete/${id}`, {
    method: 'DELETE'
  })
}
