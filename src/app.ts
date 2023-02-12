import { history } from 'umi'
import { removeToken } from './utils/auth'
import { useSelector } from 'dva'
export type InitialState = {
  name: string
  avatar: string
}

// 获取初始化数据
export function getInitialState(): InitialState {
  return {
    name: '',
    avatar: ''
  }
}

// 退出登录
export const layout = {
  logout: (initialState: InitialState) => {
    // console.log(initialState)
    removeToken()
    history.push('/user/login')
  }
}
