# 仓库管理系统 umi 版

## 使用说明

安装依赖

```sh
yarn
```

启动项目

```sh
yarn start
```

## 问题汇总

1. 使用约定式路由时，开启 `layout: {}` 后，我希望登录页、注册页以及 404 页面不要出现 layout，就必须在 `routes` 中手抄一份路由表，并将这些不希望出现 layout 的页面设置 `layout: false`，由于需要手抄一份完整的 `routes`，则完全体现不出约定式路由的作用。
A: umi Github 上的 issues 有人反馈了该问题，给的答复也是手抄一份，秀。为了使系统更灵活的扩展新功能，之后打算给前端提供一个动态路由接口，也就用不到约定式路由了，所以暂时无视这个问题。

2. 登录页、注册页设置 `layout: false` 后，含有 layout 的页面的侧边栏还是会出现这两个路由的菜单？
A: 路由添加 `hideInMenu: true` 配置。参考：<https://v3.umijs.org/zh-CN/plugins/plugin-layout#flatmenu> ✔

3. request 模块无法设置统一的请求 baseUrl？
A: 自己使用 umi-request 的 extend 模块改造 request，刚好也可以将请求拦截器、相应拦截器功能在此一并完成。✔
✔
4. 对于需要进行鉴权的路由，每个路由需要单独指定高阶组件 wrappers，不能统一拦截吗？
A：将需要鉴权的路由用一个父路由包裹，在父级路由指定高阶组件 wrappers。该方法由于需要配置父级容器路由，还要设置 `flatMenu: true` 将父容器从左侧菜单栏中隐藏，只展示子路由，所以操作成本过高，呃！

5. 项目目录所在层级过深时开启 `mfsu: {}` 功能会报错，会提示找不到对应的缓存文件？
A: 由于缓存文件的文件名是根据项目的绝对路径来命名的，项目放置在较深的文件夹下导致文件名被裁剪从而变得不完整了，暂时把项目放到桌面运行才可以开启 mfsu 提速功能。✔

6. 配置顶部导航后出现问题 `[antd: Dropdown] 'overlay' is deprecated. Please use 'menu' instead.` 和 `[antd: Menu] 'children' will be removed in next major version. Please use 'items' instead.`？
A：字面意思可见是这俩组件的参数发生了变更。由于 `@ant-design/pro-layout` 中的组件写法未跟进最新 `antd` 要求的写法所致，通过了多次降版本、升版本试图找到一个两者想契合的版本，。  ✔

7. 默认的 layout 顶部右侧未显示退出按钮？
A：umi Github 上的 issues 有人反馈了该问题，没有得到解答，秀。umi 官网 `插件 -> Plugins -> @umijs/plugin-layout` 中虽然提到了 `logout` 的配置，但是说得非常不清楚，也不贴个例子。最后还是在 `Ant Design Pro -> 布局` 中看到了例子才知道怎么配置，[Ant Design Pro 官网](https://beta-pro.ant.design/docs/layout-cn)。✔

8. 配置开启 `dva: {}` 后，试图在页面中使用 model，出现未提供 `<Provider/>` 的报错信息，且无法从 umi 中导入 `Effect, Reducer, Subscription` 等模块？
A：根据 issues 中提供的方案，尝试 `ctrl + shift + p -> 输入 server -> 重启 TS 服务器`，并未得到解决。最终将 `src/.umi` 和 `node_modules` 文件删除，重新下载依赖并运行项目得以解决，大概率 `src/.umi` 中的缓存所致。✔
