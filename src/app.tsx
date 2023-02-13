import { history } from 'umi'
import { getMenuListAPI } from './pages/Menu/service'
import { getToken, removeToken } from './utils/auth'
import { createFromIconfontCN } from '@ant-design/icons'
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

let extraRoutes: Array<any> = []
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_3892069_b5k8lymbe56.js'
})

// 拼接菜单
function parseRoutes(userRoutes: any[]) {
  if (userRoutes) {
    return userRoutes.map((item: any) => ({
      ...item,
      //  Ant Design 的图标库 ==> https://www.iconfont.cn/collections/detail?cid=9402
      icon: <IconFont type={item.icon} />,
      component: require(`${item.component}/index.tsx`).default
    }))
  }
}
// 修改路由
export function patchRoutes({ routes }: { routes: Array<any> }) {
  parseRoutes(extraRoutes)?.forEach((item) => {
    routes[0].routes[1].routes.splice(-2, 0, item)
  })
}

// 渲染路由
export function render(oldRender: any) {
  if (getToken()) {
    getMenuListAPI().then((res) => {
      extraRoutes = res.data as Array<any>
      oldRender()
    })
  } else {
    oldRender()
  }
}
