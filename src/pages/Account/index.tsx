import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  InputNumber,
  InputRef,
  message,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tag
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { registerAPI } from '../User/Register/service'
import { deleteUserAPI, editUserAPI, getUserListAPI, User } from './service'
import RoleTag from '@/components/RoleTag'
import { useSelector } from 'umi'

type PageQuery = {
  queryString?: string
  sex?: 0 | 1 | 2
  roleId?: 0 | 1 | 2
}

const initialPageQuery = {
  pageNum: 1,
  pageSize: 10,
  params: {}
}

// 性别枚举
enum sexEnum {
  女,
  男,
  未知
}

// 性别对应颜色枚举
enum sexColorEnum {
  pink,
  blue,
  grey
}

export default function Account() {
  const [userList, setUserList] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const {
    userInfo: { roleId }
  } = useSelector((state: any) => state.user)

  const [searchForm] = Form.useForm()
  const [pageQuery, setPageQuery] = useState<IPageQuery<PageQuery>>(initialPageQuery)

  // 获取用户列表
  const getUserList = async () => {
    const { data, total } = await getUserListAPI<PageQuery>(pageQuery)
    setUserList(data || [])
    setTotal(total || 0)
  }

  useEffect(() => {
    getUserList()
  }, [pageQuery])

  // 设置查询参数
  const handleSearch = (values: PageQuery) => {
    setPageQuery({
      ...pageQuery,
      params: {
        queryString: values.queryString,
        sex: values.sex,
        roleId: values.roleId
      }
    })
  }

  // 重置查询参数
  const handleReset = () => {
    setPageQuery(initialPageQuery)
    searchForm.resetFields()
  }

  // 删除用户
  const handleDeleteUser = (id: number) => {
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

  const [addOrEditForm] = Form.useForm<User>()
  const [isAddOrEditModalOpen, setIsAddOrEditModalOpen] = useState(false)
  const type = useRef('add')
  const nameInputRef = useRef<InputRef>(null)

  // 打开新增或编辑用户模态框
  const showAddOrEditModal = (row?: User) => {
    type.current = 'add'
    if (row) {
      type.current = 'edit'
      addOrEditForm.setFieldsValue(row)
    }
    setIsAddOrEditModalOpen(() => {
      // 打开模态框输入框自动获得焦点
      setTimeout(() => {
        nameInputRef.current?.focus({
          cursor: 'end'
        })
      }, 0)
      return true
    })
  }

  // 提交新增或编辑表单
  const handleAddOrEditFinish = async (userInfo: User) => {
    const res = await (type.current === 'add' ? registerAPI(userInfo) : editUserAPI(userInfo))
    if (res.code === 200) {
      message.success(res.message, 2)
      addOrEditForm.resetFields()
      setIsAddOrEditModalOpen(false)
      getUserList()
    } else {
      message.error(res.message)
    }
  }

  // 新增或编辑用户信息
  const handleAddOrEdit = async () => {
    // 校验表单
    const userInfo = await addOrEditForm.validateFields()
    handleAddOrEditFinish(userInfo)
  }

  // 取消新增或编辑用户信息
  const handleAddOrEditCancel = () => {
    setIsAddOrEditModalOpen(false)
  }

  // 关闭模态框
  const handleClosed = () => {
    addOrEditForm.resetFields()
  }

  // 分页
  const onPagination = (pageNum: number, pageSize: number) => {
    setPageQuery({
      ...pageQuery,
      pageNum,
      pageSize
    })
  }

  // 修改账号状态
  const onChangeValid = (checked: boolean, row: User) => {
    row.isValid = checked
    type.current = 'edit'
    handleAddOrEditFinish(row)
  }

  // 表格列配置
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
        <Button type="link" key={row.id} onClick={() => showAddOrEditModal(row)}>
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
        <Tag color={sexColorEnum[sex]} key={row.id}>
          {/* {sex === 0 ? '女' : sex === 1 ? '男' : '未知'} */}
          {sexEnum[sex]}
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
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center'
    },
    {
      title: '最后更新',
      dataIndex: 'updateTime',
      align: 'center'
    },
    {
      title: '账号状态',
      dataIndex: 'isValid',
      align: 'center',
      render: (isValid: boolean, row) => {
        return (
          <Switch
            disabled={row.roleId === 0}
            key={row.id}
            checkedChildren="启用"
            unCheckedChildren="停用"
            checked={isValid}
            onChange={(checked) => onChangeValid(checked, row)}
          />
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, row) => (
        <Space>
          <Button type="primary" onClick={() => showAddOrEditModal(row)}>
            编辑
          </Button>
          <Button danger type="primary" hidden={row.roleId === 0} onClick={() => handleDeleteUser(row.id!)}>
            删除
          </Button>
        </Space>
      ),
      align: 'center'
    }
  ]

  return (
    <div>
      {/* 搜索栏 */}
      <div className="search-bar">
        <Form name="search-form" form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="queryString">
            <Input placeholder="用户名/昵称/手机号" style={{ width: 180 }} prefix={<SearchOutlined />} />
          </Form.Item>
          <Form.Item name="sex">
            <Select
              placeholder="请选择性别"
              className="w120"
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
              className="w120"
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
                onOk={handleAddOrEdit}
                onCancel={handleAddOrEditCancel}
                afterClose={handleClosed}
                forceRender={true}
              >
                <Form
                  name="add-or-edit-user-form"
                  form={addOrEditForm}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  autoComplete="off"
                  initialValues={{ sex: 2, roleId: 2, isValid: true }}
                  onFinish={handleAddOrEditFinish}
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
                    <Input ref={nameInputRef} />
                  </Form.Item>
                  <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                      { required: type.current === 'add', message: '请输入密码!' },
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
                      disabled={addOrEditForm.getFieldValue('roleId') === 0}
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
                  <Form.Item label="账号状态" name="isValid" valuePropName="checked">
                    <Switch checkedChildren="启用" unCheckedChildren="停用" />
                  </Form.Item>
                  {/* 按钮仅用于触发表单的回车提交事件，可用 hidden 属性隐藏 */}
                  <button type="submit" hidden></button>
                </Form>
              </Modal>
            </Space>
          </Form.Item>
        </Form>
      </div>
      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={userList}
        rowKey="id"
        scroll={{ y: 660 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          total: total,
          showTotal: (total) => `总 ${total} 条`,
          defaultPageSize: 10,
          defaultCurrent: 1,
          onChange: onPagination
        }}
      />
    </div>
  )
}
