import request from '@/utils/request'
import { ResultType } from '../User/Register/service'

export async function getMenuListAPI<T>() {
  return request<ResultType<T>>('/menu/list', {
    method: 'GET'
  })
}
