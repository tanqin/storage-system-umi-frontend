import { history, IRoute } from 'umi'
import IconFont from './components/IconFont'
import { getMenuAuthAPI } from './pages/Menu/service'
import { getToken, removeToken } from './utils/auth'
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

export const layout = {
  // 退出登录
  logout: (initialState: InitialState) => {
    // console.log(initialState)
    removeToken()
    history.push('/user/login')
  },
  // 底部
  footerRender: () => {
    return (
      <p
        style={{
          height: '40px',
          lineHeight: '40px',
          marginBottom: 0,
          textAlign: 'center',
          fontSize: '18px'
        }}
      >
        MIT Licensed | Copyright © 2023-present tanqin
      </p>
    )
  }
}

// 权限路由
let authRoutes: IRoute[] = []

// 改造组件路径
function remakeComponentPath(componentPath: string): string {
  return componentPath.replace('@/', './')
}

// 解析菜单(将图片、组件路径变为 JSX.Element)
function parseRoutes(authRoutes: IRoute[]) {
  if (authRoutes.length) {
    return authRoutes.map((item: IRoute) => ({
      ...item,
      //  Ant Design 的图标库 ==> https://www.iconfont.cn/collections/detail?cid=9402
      // 图标批量入库：进入 https://www.iconfont.cn/collections/detail?cid=9402 => F12 => document.querySelectorAll('.icon-gouwuche1').forEach(i=>setTimeout(()=>{i.click()}))
      icon: <IconFont type={item.icon} />,
      component: require(`${remakeComponentPath(item.component)}`).default
    }))
  }
}
// 修改路由，如：增加权限路由
export function patchRoutes({ routes }: { routes: IRoute[] }) {
  parseRoutes(authRoutes)?.forEach((item) => {
    routes[0].routes![1].routes!.splice(-2, 0, item)
  })
}

// 运行时渲染函数
export function render(oldRender: any) {
  if (getToken()) {
    getMenuAuthAPI()
      .then((res) => {
        authRoutes = (res?.data || []) as IRoute[]
        oldRender()
      })
      .catch((err) => {
        history.push('/user/login')
      })
  } else {
    oldRender()
  }
}
