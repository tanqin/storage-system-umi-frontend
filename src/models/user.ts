import { Effect, ImmerReducer, Reducer, Subscription } from 'umi'

export interface ModelState {
  name: string
}

export interface ModelType {
  namespace?: string
  state: ModelState
  effects: {
    query: Effect
  }
  reducers: {
    save: Reducer<ModelState>
    // 启用 immer 之后
    // save: ImmerReducer<ModelState>;
  }
  subscriptions: { setup: Subscription }
}

const IndexModel: ModelType = {
  namespace: 'user',
  state: {
    name: '张三'
  },

  effects: {
    *query({ payload }, { call, put }) {}
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
  },
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
export default IndexModel
