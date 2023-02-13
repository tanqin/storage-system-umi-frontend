import IconFont from '@/components/IconFont'
import RoleTag from '@/components/RoleTag'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { IRoute } from 'umi'
import { getMenuListAPI } from './service'

export default function Menu() {
  const [searchForm] = Form.useForm()
  const [menuList, setMenuList] = useState<IRoute[]>([])
  const [total, setTotal] = useState(0)
  const [searchParams, setSearchParams] = useState<SearchParams>({
    pageNum: 1,
    pageSize: 10,
    params: {}
  })

  type SearchParams = {
    pageNum: number
    pageSize: number
    params: {
      queryString?: string
      roleIds?: string
    }
  }

  const getMenuList = async () => {
    const { data: menuList = [] } = await getMenuListAPI(searchParams)
    menuList.unshift({
      id: -1,
      pid: 0,
      name: '首页',
      path: '/index',
      icon: 'icon-database',
      component: './pages',
      level: 0,
      roleIds: '0,1,2'
    })
    setMenuList(menuList)
    setTotal(0)
  }
  useEffect(() => {
    getMenuList()
  }, [searchParams])

  // 分页
  const onChange = (pageNum: number, pageSize: number) => {
    setSearchParams({
      ...searchParams,
      pageNum,
      pageSize
    })
  }

  // 搜索
  const onSearch = (values: { queryString: string; roleIdsArr: string[] }) => {
    setSearchParams({
      ...searchParams,
      params: {
        queryString: values.queryString,
        roleIds: values.roleIdsArr
          ?.sort((a, b) => parseInt(a) - parseInt(b))
          .toString()
      }
    })
  }

  // 重置搜索参数
  const handleReset = () => {
    setSearchParams({
      pageNum: 1,
      pageSize: 10,
      params: {}
    })
    searchForm.resetFields()
  }

  const columns: ColumnsType<IRoute> = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      render: (name, row) => (
        <Button
          disabled={row.id === -1}
          type="link"
          key={row.id}
          // onClick={() => showAddOrEditModal(row)}
        >
          {name}
        </Button>
      ),
      align: 'center'
    },
    {
      title: '菜单id',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: '父级id',
      dataIndex: 'pid',
      align: 'center'
    },
    {
      title: '路径',
      dataIndex: 'path',
      align: 'center'
    },
    {
      title: '图标',
      dataIndex: 'icon',
      align: 'center',
      render: (icon, row) => <IconFont type={icon} style={{ fontSize: 20 }} />
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      align: 'center'
    },
    {
      title: '排序级别',
      dataIndex: 'level',
      align: 'center'
    },
    {
      title: '授权角色',
      dataIndex: 'roleIds',
      align: 'left',
      width: 260,
      render: (roleIds: string, row) => {
        return roleIds
          .split(',')
          .map((roleId) => <RoleTag roleId={parseInt(roleId)} />)
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, row) => (
        <Space hidden={row.id === -1}>
          <Button type="primary" /*  onClick={() => showAddOrEditModal(row)} */>
            编辑
          </Button>
          <Button
            danger
            type="primary"
            /*  onClick={() => onDeleteUser(row.id)} */
          >
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
        <Form
          name="search-form"
          form={searchForm}
          layout="inline"
          onFinish={onSearch}
        >
          <Form.Item name="queryString">
            <Input
              placeholder="菜单名称/路径/组件路径"
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
          </Form.Item>
          <Form.Item name="roleIdsArr">
            <Select
              placeholder="授权角色(支持多选)"
              style={{ width: 300 }}
              mode="multiple"
              allowClear
              options={[
                {
                  value: '0',
                  label: '超级管理员'
                },
                {
                  value: '1',
                  label: '管理员'
                },
                {
                  value: '2',
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
              {/* <Button onClick={() => showAddOrEditModal()}>新增</Button>
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
                  <Form.Item label="角色" name="roleId">
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
              </Modal> */}
            </Space>
          </Form.Item>
        </Form>
      </div>
      <Table
        columns={columns}
        dataSource={menuList}
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
