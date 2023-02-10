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

1. 使用约定式路由时，开启 `layout:{}` 后，我希望登录页、注册页以及 404 页面不要出现 layout，必须在 `routes` 中手抄一份路由表，并将这些不希望出现 layout 的页面设置 `layout: false`，由于需要手抄一份完整的 `routes`，则完全体现不出约定式路由的作用了。

2. request 模块无法设置统一的请求 baseUrl。

3. umi 为什么没有出现跨域问题？

4. 每个路由需要单独指定高阶组件 wrappers，不能统一拦截吗？
