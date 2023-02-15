import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { Form, Button, Input, Popover, Progress, Select, message } from 'antd'
import type { Store } from 'antd/es/form/interface'
import { Link, useRequest, history } from 'umi'
import type { ResultType } from './service'
import { registerAPI } from './service'
import styles from './style.less'
import { User } from '@/pages/Account/service'

const FormItem = Form.Item
const { Option } = Select
const InputGroup = Input.Group

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <span>强度：强</span>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <span>强度：中</span>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <span>强度：太短</span>
    </div>
  )
}

const passwordProgressMap: {
  ok: 'success'
  pass: 'normal'
  poor: 'exception'
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception'
}

const UserRegister: FC = () => {
  // const [count, setCount]= useState(0)
  const [visible, setVisible] = useState(false)
  const [prefix, setPrefix] = useState('86')
  const [popover, setPopover] = useState(false)
  const confirmDirty = false
  let interval: number | undefined
  const [form] = Form.useForm<User>()

  useEffect(
    () => () => {
      clearInterval(interval)
    },
    [interval]
  )

  // const onGetCaptcha = () => {
  //   let counts = 59
  //   setCount(counts)
  //   interval = window.setInterval(() => {
  //     counts -= 1
  //     setCount(counts)
  //     if (counts === 0) {
  //       clearInterval(interval)
  //     }
  //   }, 1000)
  // }

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password')
    if (value && value.length > 9) {
      return 'ok'
    }
    if (value && value.length > 5) {
      return 'pass'
    }
    return 'poor'
  }

  const { loading: submitting, run: register } = useRequest<ResultType>(registerAPI, {
    manual: true,
    onSuccess: (res: ResultType, params: User[]) => {
      // debugger
      if (res.code === 200) {
        message.success(res.message)
        history.push({
          pathname: '/user/login',
          state: {
            username: params[0].username,
            password: params[0].password
          }
        })
      } else {
        message.error(res.message)
      }
    }
  })
  const onFinish = (values: Store) => {
    register(values)
  }

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!')
    }
    return promise.resolve()
  }

  const checkPassword = (_: any, value: string) => {
    const promise = Promise
    // 没有值的情况
    if (!value) {
      setVisible(!!value)
      return promise.reject('请输入密码!')
    }
    // 有值的情况
    if (!visible) {
      setVisible(!!value)
    }
    setPopover(!popover)
    if (value.length < 6) {
      return promise.reject('')
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm'])
    }
    return promise.resolve()
  }

  const changePrefix = (value: string) => {
    setPrefix(value)
  }

  // 渲染密码强度校验进度条
  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password')
    const passwordStatus = getPasswordStatus()
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null
  }

  return (
    <div className={styles.main}>
      <h2>注册</h2>
      <Form form={form} name="UserRegister" onFinish={onFinish}>
        <FormItem
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名!'
            }
          ]}
        >
          <Input placeholder="用户名" />
        </FormItem>
        <Popover
          getPopupContainer={(node) => {
            if (node && node.parentNode) {
              return node.parentNode as HTMLElement
            }
            return node
          }}
          content={
            visible && (
              <div style={{ padding: '4px 0' }}>
                {passwordStatusMap[getPasswordStatus()]}
                {renderPasswordProgress()}
                <div style={{ marginTop: 10 }}>
                  <span>请至少输入 6 个字符的密码。</span>
                </div>
              </div>
            )
          }
          overlayStyle={{ width: 240 }}
          placement="right"
          open={visible}
        >
          <FormItem
            name="password"
            className={form.getFieldValue('password') && form.getFieldValue('password').length > 0 && styles.password}
            rules={[
              {
                validator: checkPassword
              }
            ]}
          >
            <Input type="password" placeholder="至少6位密码，区分大小写" />
          </FormItem>
        </Popover>
        <FormItem
          name="confirm"
          rules={[
            {
              required: true,
              message: '确认密码'
            },
            {
              validator: checkConfirm
            }
          ]}
        >
          <Input type="password" placeholder="确认密码" />
        </FormItem>
        <FormItem name="nickname">
          <Input placeholder="昵称" />
        </FormItem>
        <InputGroup compact>
          <Select value={prefix} onChange={changePrefix} style={{ width: '20%' }}>
            <Option value="86">+86</Option>
            <Option value="87">+87</Option>
          </Select>
          <FormItem
            style={{ width: '80%' }}
            name="phone"
            rules={[
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号格式错误!'
              }
            ]}
          >
            <Input placeholder="手机号" />
          </FormItem>
        </InputGroup>

        {/* <Row gutter={8}>
          <Col span={16}>
            <FormItem
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '请输入验证码!'
                }
              ]}
            >
              <Input  placeholder="验证码" />
            </FormItem>
          </Col>
          <Col span={8}>
            <Button

              disabled={!!count}
              className={styles.getCaptcha}
              onClick={onGetCaptcha}
            >
              {count ? `${count} s` : '获取验证码'}
            </Button>
          </Col>
        </Row> */}
        <FormItem>
          <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
            <span>注册</span>
          </Button>
          <Link className={styles.login} to="/user/login">
            <span>已有账户，去登陆？</span>
          </Link>
        </FormItem>
      </Form>
    </div>
  )
}
export default UserRegister
