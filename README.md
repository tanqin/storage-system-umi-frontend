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

1. 使用约定式路由时，开启 `layout: {}` 后，我希望登录页、注册页以及 404 页面不要出现 layout，必须在 `routes` 中手抄一份路由表，并将这些不希望出现 layout 的页面设置 `layout: false`，由于需要手抄一份完整的 `routes`，则完全体现不出约定式路由的作用。
A: umi 官方的 issues 有人反馈了该问题，给的答复也是手抄一份。

2. 登录页、注册页设置 `layout: false` 后，含有 layout 的页面的侧边栏还是会出现这两个路由的菜单？
A: 路由添加 `hideInMenu: true` 配置。参考：<https://v3.umijs.org/zh-CN/plugins/plugin-layout#flatmenu> ✔

3. request 模块无法设置统一的请求 baseUrl？
A: 自己使用 umi-request 的 extend 模块改造 request，刚好也可以将请求拦截器、相应拦截器功能在此一并完成。✔

4. 对于需要进行鉴权的路由，每个路由需要单独指定高阶组件 wrappers，不能统一拦截吗？
A：将需要鉴权的路由用一个父路由包裹，在父级路由指定高阶组件 wrappers。由于需要配置父级容器路由，还要设置 `flatMenu: true` 将父容器从左侧菜单栏中隐藏，子展示子路由，所以操作成本过高。

5. 项目目录所在层级过深时开启 `mfsu: {}` 功能会报错，会提示找不到对应的缓存文件？
A: 只能乖乖将项目拿到桌面来运行了。✔
