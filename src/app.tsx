import { history } from 'umi'
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
let authRoutes: Array<any> = []

// 拼接菜单
function parseRoutes(authRoutes: any[]) {
  if (authRoutes) {
    return authRoutes.map((item: any) => ({
      ...item,
      //  Ant Design 的图标库 ==> https://www.iconfont.cn/collections/detail?cid=9402
      // 图标批量入库：进入 https://www.iconfont.cn/collections/detail?cid=9402 => F12 => document.querySelectorAll('.icon-gouwuche1').forEach(i=>setTimeout(()=>{i.click()}))
      icon: <IconFont type={item.icon} />,
      component: require(`${item.component}`).default
    }))
  }
}
// 修改路由，如：增加权限路由
export function patchRoutes({ routes }: { routes: Array<any> }) {
  parseRoutes(authRoutes)?.forEach((item) => {
    routes[0].routes[1].routes.splice(-2, 0, item)
  })
}

// 运行时渲染函数
export function render(oldRender: any) {
  // 将 oldRender 存为 window 变量，才能在登陆后重新获取路由。参考：https://github.com/umijs/umi/issues/2511

  if (getToken()) {
    getMenuAuthAPI().then((res) => {
      authRoutes = (res?.data || []) as Array<any>
      oldRender()
    })
  } else {
    oldRender()
  }
}
