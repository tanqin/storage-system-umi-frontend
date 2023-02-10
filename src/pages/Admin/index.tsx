import { SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { getUserListAPI, User } from './service'

export default function Admin() {
  const [form] = Form.useForm()

  const [userList, setUserList] = useState<User[]>([])
  type SearchParams = {
    roleId?: number
    queryString: string
    sex: number
  }
  const [searchParams, setSearchParams] = useState<SearchParams | undefined>(
    undefined
  )
  const searchParamsRef = useRef<SearchParams>()

  const getUserList = async () => {
    const res = await getUserListAPI({
      pageNum: 1,
      pageSize: 10,
      params: searchParams
    })
    setUserList(res.data || [])
  }

  useEffect(() => {
    getUserList()
  }, [])

  useEffect(() => {
    getUserList()
  }, [searchParams])

  // 查询用户列表
  const onSearch = (values: { queryString: string; sex: number }) => {
    setSearchParams({
      ...searchParams,
      queryString: values.queryString,
      sex: values.sex
    })
  }

  // 重置查询参数
  const handleReset = () => {
    setSearchParams(undefined)
    form.setFieldsValue({ queryString: undefined, sex: undefined })
  }

  interface DataType {
    id: number
    username: string
    nickname: string
    age: number
    sex: number | null | undefined
    phone: string
    roleId: number
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: '账号',
      dataIndex: 'username',
      render: (username, row) => (
        <a href="javascript(0):;" key={row.id}>
          {username}
        </a>
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
          color={sex === 0 ? 'pink' : sex === 1 ? 'skyblue' : 'grey'}
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
      render: (roleId, row) => (
        <Tag
          color={roleId === 2 ? 'gray' : roleId === 1 ? 'yellow' : 'gold'}
          key={row.id}
        >
          {roleId === 2 ? '普通账号' : roleId === 1 ? '管理员' : '超级管理员'}
        </Tag>
      ),
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, row) => (
        <Space>
          <Button type="primary">编辑</Button>
          <Button danger type="primary">
            删除
          </Button>
        </Space>
      ),
      align: 'center'
    }
  ]

  const data: DataType[] = userList

  return (
    <div>
      <div className="search-bar">
        <Form form={form} layout="inline" onFinish={onSearch}>
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
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
              <Button>新增</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  )
}
