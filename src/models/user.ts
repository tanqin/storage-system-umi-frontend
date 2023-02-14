import { User } from '@/pages/Account/service'
import { getUserInfoAPI } from '@/pages/service'
import { ResultType } from '@/pages/User/Register/service'
import { getToken } from '@/utils/auth'
import { Effect, ImmerReducer, Subscription } from 'umi'

export interface UserModelState {
  userInfo: User | {}
}

export interface ModelType {
  namespace?: string
  state: UserModelState
  effects: {
    getUserInfo: Effect
  }
  reducers: {
    saveUserInfo: ImmerReducer<UserModelState>
  }
  subscriptions: { setup: Subscription }
}

const UserModel: ModelType = {
  namespace: 'user',
  state: {
    userInfo: {}
  },
  // 用来处理异步操作。如果需要调取接口的话，前台页面就需要调用 effects 里的方法。
  effects: {
    *getUserInfo({ payload }, { call, put, select }) {
      const { userInfo } = yield select((state: any) => state.user)
      if (!userInfo || !Object.keys(userInfo).length) {
        // yield call 返回 Promise 对象，只有返回 resolve 方法时，才会执行下一个 yield call 。
        const res: ResultType<User> = yield call(getUserInfoAPI, payload)
        yield put({
          type: 'saveUserInfo',
          payload: res.data || {}
        })
      }
    }
  },
  // 用来处理同步操作。如果不需要调接口时候，我们前台传递的 action 可以直接调用 reducers 里的方法。
  reducers: {
    saveUserInfo(state, action) {
      state.userInfo = action.payload
    }
  },
  // 订阅监听，如我们监听路由，路有变化处理执行相应逻辑
  subscriptions: {
    setup({ dispatch, history }) {
      const whiteList = ['/user/login', '/user/register', '/403', '/404', '/500']
      return history.listen(({ pathname }) => {
        if (!whiteList.find((path) => path === pathname)) {
          // debugger
          dispatch({ type: 'getUserInfo' })
        } else if (pathname === '/user/login' && getToken()) {
          history.push('/')
        }
      })
    }
  }
}
export default UserModel
