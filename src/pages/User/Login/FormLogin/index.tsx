import React from 'react'
import styles from './index.less'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { loginAPI, LoginParams } from './service'
import { history, Link } from 'umi'

const LoginForm = () => {
  const onFinish = (values: LoginParams) => {
    loginAPI({ username: values.username, password: values.password }).then(
      (res) => {
        if (res.code === 200) {
          message.success('登录成功！', 1)
          history.push({
            pathname: '/'
          })
        } else {
          message.error('用户名或密码错误！', 2)
        }
      }
    )
  }

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ username: 'admin', password: 'admin', remember: true }}
      onFinish={onFinish}
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

export default () => (
  <div className={styles.container}>
    <div id="form-login">
      <LoginForm />
    </div>
  </div>
)
