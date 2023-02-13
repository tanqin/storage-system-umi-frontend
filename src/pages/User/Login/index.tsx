import styles from './index.less'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { loginAPI, LoginParams } from './service'
import { IRouteComponentProps, Link, Location } from 'umi'
import { setToken } from '@/utils/auth'
import { ReactNode } from 'react'
import { User } from '@/pages/Account/service'
const LoginForm = ({ state }: PropsType<User>) => {
  // debugger
  const onLogin = (values: LoginParams) => {
    loginAPI<{ token: string }>({
      username: values.username,
      password: values.password
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
        message.error('用户名或密码错误！', 2)
      }
    })
  }

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        username: state?.username || 'admin',
        password: state?.password || 'admin',
        remember: true
      }}
      onFinish={onLogin}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名！' }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="用户名"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码！' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="密码"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>记住密码</Checkbox>
        </Form.Item>

        <a
          className="login-form-forgot"
          href="https://www.baidu.com"
          target="_blank"
        >
          忘记密码
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          登录
        </Button>
        <Link to="/user/register">马上注册！</Link>
      </Form.Item>
    </Form>
  )
}

export interface PropsType<T = undefined> {
  location?: Location
  children?: ReactNode
  state?: T
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
