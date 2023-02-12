import { User } from '@/pages/Admin/service'
import { getUserInfoAPI } from '@/pages/service'
import { ResultType } from '@/pages/User/Register/service'
import { Effect, ImmerReducer, Reducer, Subscription } from 'umi'

export interface ModelState {
  userInfo: User | {}
}

export interface ModelType {
  namespace?: string
  state: ModelState
  effects: {
    getUserInfo: Effect
  }
  reducers: {
    saveUserInfo: ImmerReducer<ModelState>
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
    *getUserInfo({ payload }, { call, put }) {
      // yield call 返回 Promise 对象，只有返回 resolve 方法时，才会执行下一个 yield call 。
      const res: ResultType<User> = yield call(getUserInfoAPI, payload)
      yield put({
        type: 'saveUserInfo',
        payload: res.data || {}
      })
    }
  },
  // 用来处理同步操作。如果不需要调接口时候，我们前台传递的 action 可以直接调用 reducers 里的方法。
  reducers: {
    saveUserInfo(state, action) {
      state.userInfo = action.payload
    }
  },
  // 订阅监听，比如我们监听路由，进入页面要做什么，可以在这写
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/') {
          dispatch({
            type: 'query'
          })
        }
      })
    }
  }
}
export default UserModel
