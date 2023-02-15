import { ReactNode, useEffect, useState } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { IRouteComponentProps, Link, Location } from 'umi'
import Cookies from 'js-cookie'
import { loginAPI } from './service'
import { setToken } from '@/utils/auth'
import { User } from '@/pages/Account/service'
import styles from './index.less'
import { decrypt, encrypt } from '@/utils/encrypt'

export interface PropsType<T = undefined> {
  children?: ReactNode
  state?: T
}

const LoginForm = ({ state }: PropsType<User>) => {
  const [form] = Form.useForm<User>()

  // 设置默认用户信息
  const setDefaultLoginUser = () => {
    if (state?.username && state?.password) {
      console.log('state')
      // 从注册页注册成功后跳转至登录页，从 state 中获取账号密码填充
      form.setFieldsValue({ username: state?.username, password: state?.password, rememberMe: true })
    } else {
      // 其他情况，冲 cookie 中获取账号密码
      console.log('cookie')
      const username = Cookies.get('username')!
      const password = decrypt(Cookies.get('password')!)
      const rememberMe = Cookies.get('rememberMe')
      if (password) {
        form.setFieldsValue({ username, password, rememberMe: Boolean(rememberMe) })
      }
    }
  }

  useEffect(() => {
    setDefaultLoginUser()
  }, [])

  // 登录
  const handleLogin = (loginUser: User) => {
    const { username, password, rememberMe } = loginUser
    if (rememberMe) {
      // 有效期 30 天
      const expires = 30
      // 密码加密
      const encryptPassword = encrypt(password!) as string
      Cookies.set('username', username, { expires })
      Cookies.set('password', encryptPassword, { expires })
      Cookies.set('rememberMe', rememberMe.toString(), { expires })
    } else {
      Cookies.remove('username')
      Cookies.remove('password')
      Cookies.remove('rememberMe')
    }
    loginAPI<{ token: string }>({
      username: loginUser.username,
      password: loginUser.password
    }).then((res) => {
      if (!res) return
      if (res.code === 200 && res.data?.token) {
        setToken(res.data.token)
        message.success('登录成功！', 1)
        // history.replace() 由于不会刷新页面，所以没法触发运行时配置中的 render() 去重新获取路由，暂时改为 window.location.href
        // history.replace({
        //   pathname: '/'
        // })
        window.location.href = '/'
      } else {
        message.error(res.message, 2)
      }
    })
  }

  return (
    <Form name="normal_login" form={form} className="login-form" onFinish={handleLogin}>
      <Form.Item name="username" rules={[{ required: true, message: '请输入用户名！' }]}>
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
        <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="密码" />
      </Form.Item>
      <Form.Item>
        <Form.Item name="rememberMe" valuePropName="checked" noStyle>
          <Checkbox>记住密码</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="https://www.baidu.com" target="_blank">
          忘记密码
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-button">
          登录
        </Button>
        <Link to="/user/register" className="register">
          没有账户，去注册？
        </Link>
      </Form.Item>
    </Form>
  )
}

export default function Login({ location }: IRouteComponentProps) {
  // debugger
  return (
    <div className={styles['login-container']}>
      <div id="form-login">
        <LoginForm state={location.state as User} />
      </div>
    </div>
  )
}
