import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Space,
  Table,
  Tag
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { registerAPI } from '../User/Register/service'
import { deleteUserAPI, editUserAPI, getUserListAPI, User } from './service'
import RoleTag from '@/components/RoleTag'
import { useSelector } from 'umi'

type SearchParams = {
  pageNum: number
  pageSize: number
  params: {
    queryString?: string
    sex?: number
    roleId?: number
  }
}

export default function Account() {
  const [searchForm] = Form.useForm()
  const [userList, setUserList] = useState<User[]>([])
  const {
    userInfo: { roleId }
  } = useSelector((state: any) => state.user)

  const [searchParams, setSearchParams] = useState<SearchParams>({
    pageNum: 1,
    pageSize: 10,
    params: {}
  })

  const [total, setTotal] = useState(0)
  const getUserList = async () => {
    const res = await getUserListAPI<User[]>(searchParams)
    setUserList(res?.data || [])
    setTotal(res?.total || 0)
  }

  useEffect(() => {
    getUserList()
  }, [searchParams])

  // 查询用户列表
  const onSearch = (values: {
    queryString: string
    sex: number
    roleId: number
  }) => {
    setSearchParams({
      ...searchParams,
      params: {
        queryString: values.queryString,
        sex: values.sex,
        roleId: values.roleId
      }
    })
  }

  // 重置查询参数
  const handleReset = () => {
    setSearchParams({
      pageNum: 1,
      pageSize: 10,
      params: {}
    })
    searchForm.resetFields()
  }

  // 删除用户
  const onDeleteUser = (id: number) => {
    Modal.confirm({
      title: '删除提示',
      icon: <ExclamationCircleOutlined />,
      content: '您确认删除该用户吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await deleteUserAPI(id)
        message[res.code === 200 ? 'success' : 'error'](res.message)
        getUserList()
      }
    })
  }

  const columns: ColumnsType<User> = [
    {
      title: '用户编号',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: '账号',
      dataIndex: 'username',
      render: (username, row) => (
        <Button
          type="link"
          key={row.id}
          onClick={() => showAddOrEditModal(row)}
        >
          {username}
        </Button>
      ),
      align: 'center'
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      align: 'center'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      align: 'center'
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (sex, row) => (
        <Tag
          color={sex === 0 ? 'pink' : sex === 1 ? 'blue' : 'grey'}
          key={row.id}
        >
          {sex === 0 ? '女' : sex === 1 ? '男' : '未知'}
        </Tag>
      ),
      align: 'center'
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      align: 'center'
    },
    {
      title: '角色',
      dataIndex: 'roleId',
      render: (roleId, row) => <RoleTag roleId={roleId} key={row.id} />,
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, row) => (
        <Space>
          <Button type="primary" onClick={() => showAddOrEditModal(row)}>
            编辑
          </Button>
          <Button
            danger
            type="primary"
            hidden={row.roleId === 0}
            onClick={() => onDeleteUser(row.id)}
          >
            删除
          </Button>
        </Space>
      ),
      align: 'center'
    }
  ]

  const data: User[] = userList

  const [addOrEditUserForm] = Form.useForm<User>()
  const [isAddOrEditModalOpen, setIsAddOrEditModalOpen] = useState(false)
  const type = useRef('add')

  // 新增或编辑用户模态框
  const showAddOrEditModal = (row?: User) => {
    type.current = 'add'
    if (row) {
      type.current = 'edit'
      addOrEditUserForm.setFieldsValue(row)
    }
    setIsAddOrEditModalOpen(true)
  }

  const handleAddOrEditOk = async () => {
    const userInfo = addOrEditUserForm.getFieldsValue()
    const res = await (type.current === 'add'
      ? registerAPI(userInfo)
      : editUserAPI(userInfo))
    if (res.code === 200) {
      message.success(res.message, 2)
      addOrEditUserForm.resetFields()
      setIsAddOrEditModalOpen(false)
      getUserList()
    } else {
      message.error(res.message)
    }
  }

  const handleAddCancel = () => {
    setIsAddOrEditModalOpen(false)
  }

  const handleClosed = () => {
    addOrEditUserForm.resetFields()
  }

  // 分页
  const onChange = (pageNum: number, pageSize: number) => {
    setSearchParams({
      ...searchParams,
      pageNum,
      pageSize
    })
  }

  return (
    <div>
      {/* 搜索栏 */}
      <div className="search-bar">
        <Form
          name="search-form"
          form={searchForm}
          layout="inline"
          onFinish={onSearch}
        >
          <Form.Item name="queryString">
            <Input
              placeholder="用户名/昵称/手机号"
              style={{ width: 180 }}
              prefix={<SearchOutlined />}
            />
          </Form.Item>
          <Form.Item name="sex">
            <Select
              placeholder="请选择性别"
              style={{ width: 120 }}
              allowClear
              options={[
                {
                  value: 0,
                  label: '女'
                },
                {
                  value: 1,
                  label: '男'
                },
                {
                  value: 2,
                  label: '未知'
                }
              ]}
            />
          </Form.Item>
          <Form.Item name="roleId" hidden={roleId !== 0}>
            <Select
              placeholder="请选择角色"
              style={{ width: 120 }}
              allowClear
              options={[
                {
                  value: 0,
                  label: '超级管理员'
                },
                {
                  value: 1,
                  label: '管理员'
                },
                {
                  value: 2,
                  label: '普通用户'
                }
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
              <Button onClick={() => showAddOrEditModal()}>新增</Button>
              <Modal
                title={type.current === 'add' ? '新增用户' : '编辑用户'}
                open={isAddOrEditModalOpen}
                onOk={handleAddOrEditOk}
                onCancel={handleAddCancel}
                afterClose={handleClosed}
                forceRender={true}
              >
                <Form
                  name="add-or-edit-user-form"
                  form={addOrEditUserForm}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  // onFinish={onFinish}
                  autoComplete="off"
                  initialValues={{ sex: 2, roleId: 2 }}
                >
                  <Form.Item name="id" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="用户名"
                    name="username"
                    rules={[
                      { required: true, message: '请输入用户名!' },
                      {
                        type: 'string',
                        min: 2,
                        max: 24,
                        message: '用户名字符长度需在2-24位之间'
                      }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                      { required: true, message: '请输入密码!' },
                      {
                        type: 'string',
                        min: 6,
                        max: 24,
                        message: '密码长度需在6-24位之间!'
                      }
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item label="昵称" name="nickname">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="年龄"
                    name="age"
                    rules={[
                      {
                        required: false,
                        transform: (value: number) => {
                          return value && String(value)
                        },
                        pattern: /^(0|[1-9]\d*)$/,
                        message: '年龄只能为 0 或正整数!'
                      }
                    ]}
                  >
                    <InputNumber
                      // precision={0}
                      min={0}
                      max={130}
                      style={{ width: '30%' }}
                    />
                  </Form.Item>
                  <Form.Item label="性别" name="sex">
                    <Radio.Group>
                      <Radio value={2}> 未知 </Radio>
                      <Radio value={0}> 女 </Radio>
                      <Radio value={1}> 男 </Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    label="手机号码"
                    name="phone"
                    rules={[
                      {
                        pattern: /^1[3-9]\d{9}$/,
                        message: '手机号格式错误!'
                      }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item label="角色" name="roleId" hidden={roleId !== 0}>
                    <Select
                      placeholder="请选择角色"
                      disabled={addOrEditUserForm.getFieldValue('roleId') === 0}
                      options={[
                        {
                          value: 0,
                          label: '超级管理员',
                          disabled: true
                        },
                        {
                          value: 1,
                          label: '管理员'
                        },
                        {
                          value: 2,
                          label: '普通用户'
                        }
                      ]}
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        scroll={{ y: 660 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          total: total,
          showTotal: (total) => `总 ${total} 条`,
          defaultPageSize: 10,
          defaultCurrent: 1,
          onChange: onChange
        }}
      />
    </div>
  )
}
