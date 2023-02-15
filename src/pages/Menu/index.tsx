import IconFont from '@/components/IconFont'
import RoleTag from '@/components/RoleTag'
import { ExclamationCircleOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, InputRef, message, Modal, Select, Space, Switch, Table, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { IRoute } from 'umi'
import { addOrEditMenuAPI, deleteMenuAPI, getMenuListAPI } from './service'

// 查询参数
type SearchParams = {
  queryString?: string
  roleIds?: string
}

const initialPageQuery = {
  pageNum: 1,
  pageSize: 10,
  params: {}
}

// 「首页」菜单路由
const indexMenu = {
  id: -1,
  pid: 0,
  name: '首页',
  path: '/index',
  icon: 'icon-home',
  component: './pages',
  level: 0,
  roleIds: ['0', '1', '2'],
  isValid: true
}

export default function Menu() {
  const [searchForm] = Form.useForm()
  const [menuList, setMenuList] = useState<IRoute[]>([])
  const [total, setTotal] = useState(0)
  // 分页查询参数
  const [pageQuery, setPageQuery] = useState<IPageQuery<SearchParams>>(initialPageQuery)

  // 获取菜单列表
  const getMenuList = async () => {
    const { data: menuList = [], total } = await getMenuListAPI<SearchParams>(pageQuery)
    // 字符串切割为数组，用于展示「授权角色」
    menuList.forEach((item) => {
      item.roleIds = item.roleIds.split(',')
    })

    const queryString = pageQuery.params?.queryString as string
    // 以下情况都应该显示「首页」菜单路由
    if (
      (!queryString ||
        indexMenu.name.includes(queryString) ||
        indexMenu.path.includes(queryString) ||
        indexMenu.component.includes(queryString)) &&
      (!pageQuery.params?.roleIds || indexMenu.roleIds.join() === pageQuery.params?.roleIds)
    ) {
      // 「首页」菜单路由由前端维护，没有从后端获取，所以需要添加到菜单列表用于展示
      menuList.unshift(indexMenu)
    }
    setMenuList(JSON.parse(JSON.stringify(menuList)))
    setTotal(total || 0)
  }

  useEffect(() => {
    getMenuList()
  }, [pageQuery])

  // 分页
  const onPagination = (pageNum: number, pageSize: number) => {
    setPageQuery({
      ...pageQuery,
      pageNum,
      pageSize
    })
  }

  // 搜索
  const onSearch = (values: { queryString: string; roleIdsArr: string[] }) => {
    setPageQuery({
      ...pageQuery,
      params: {
        queryString: values.queryString,
        roleIds: values.roleIdsArr?.sort((a, b) => parseInt(a) - parseInt(b)).toString()
      }
    })
  }

  // 重置搜索参数
  const handleReset = () => {
    setPageQuery(initialPageQuery)
    searchForm.resetFields()
  }

  const type = useRef('add')
  const nameInputRef = useRef<InputRef>(null)
  const [addOrEditModalShow, setAddOrEditModalShow] = useState(false)
  const [addOrEditForm] = Form.useForm<IRoute>()

  // 新增或编辑模态框
  const showAddOrEditModal = (row: IRoute) => {
    type.current = 'add'
    if (row.id) {
      type.current = 'edit'
      addOrEditForm.setFieldsValue(row)
    }
    setAddOrEditModalShow(() => {
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
  const handleAddOrEditFinish = async (menuInfo: IRoute) => {
    menuInfo.roleIds = menuInfo.roleIds.join(',')
    const res = await addOrEditMenuAPI(menuInfo)
    if (res.code === 200) {
      message.success(res.message, 2)
      addOrEditForm.resetFields()
      setAddOrEditModalShow(false)
      // window.location.href = '/menu'
      getMenuList()
    } else {
      message.error(res.message)
    }
  }

  // 新增或编辑菜单
  const handleAddOrEdit = async () => {
    const menuInfo = await addOrEditForm.validateFields()
    handleAddOrEditFinish(menuInfo)
  }

  // 取消新增或编辑操作
  const handleAddOrEditCancel = () => {
    setAddOrEditModalShow(false)
  }

  // 关闭新增或删除模态框
  const handleClosed = () => {
    addOrEditForm.resetFields()
  }

  // 删除菜单项
  const handleDeleteMenu = (id: number) => {
    Modal.confirm({
      title: '删除提示',
      icon: <ExclamationCircleOutlined />,
      content: '您确认删除该菜单项吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await deleteMenuAPI(id)
        message[res.code === 200 ? 'success' : 'error'](res.message)
        getMenuList()
      }
    })
  }

  // 修改菜单启用状态
  const onChangeValid = (checked: boolean, row: IRoute) => {
    row.isValid = checked
    handleAddOrEditFinish(row)
  }

  // 表格列配置
  const columns: ColumnsType<IRoute> = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      render: (name, row) => (
        <Button
          disabled={row.id === -1}
          type="link"
          key={row.id}
          onClick={() => showAddOrEditModal(JSON.parse(JSON.stringify(row)))}
        >
          {name}
        </Button>
      ),
      align: 'center'
    },
    // {
    //   title: '菜单id',
    //   dataIndex: 'id',
    //   align: 'center'
    // },
    // {
    //   title: '父级id',
    //   dataIndex: 'pid',
    //   align: 'center'
    // },
    {
      title: '图标',
      dataIndex: 'icon',
      align: 'center',
      render: (icon, row) => <IconFont key={row.id} type={icon} style={{ fontSize: 20 }} />
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      align: 'center'
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
      render: (roleIds: string[], row) => {
        return roleIds.map((roleId) => <RoleTag key={roleId} roleId={parseInt(roleId)} />)
      }
    },
    {
      title: '菜单状态',
      dataIndex: 'isValid',
      align: 'center',
      render: (isValid: boolean, row) => {
        return (
          <Switch
            disabled={row.id === -1}
            key={row.id}
            checkedChildren="开启"
            unCheckedChildren="关闭"
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
        <Space hidden={row.id === -1} key={row.id}>
          <Button type="primary" onClick={() => showAddOrEditModal(JSON.parse(JSON.stringify(row)))}>
            编辑
          </Button>
          <Button danger type="primary" onClick={() => handleDeleteMenu(row.id)}>
            删除
          </Button>
        </Space>
      ),
      align: 'center'
    }
  ]

  const [iconList, setIconList] = useState<{ value: string; label: string }[]>([])

  // 获取 iconfont 图标名称列表
  const getIconList = () => {
    fetch(process.env.iconScriptUrl as string)
      .then((res) => res.text())
      .then((res) => {
        const sliceRes = res.slice(res.indexOf(`<symbol id="`) + 10, res.lastIndexOf(`" viewBox="`) + 10)
        const iconList = sliceRes.split(`<symbol id="`).map((str) => {
          const iconValue = str.slice(str.indexOf('icon-'), str.lastIndexOf(`" viewBox=`))
          const iconLabel = iconValue.replace('icon-', '')
          return {
            value: iconValue,
            label: iconLabel
          }
        })
        setIconList(iconList)
      })
  }

  useEffect(() => {
    getIconList()
  }, [])

  return (
    <div>
      {/* 搜索栏 */}
      <div className="search-bar">
        <Form name="search-form" form={searchForm} layout="inline" onFinish={onSearch}>
          <Form.Item name="queryString">
            <Input placeholder="菜单名称/路径/组件路径" style={{ width: 200 }} prefix={<SearchOutlined />} />
          </Form.Item>
          <Form.Item name="roleIdsArr">
            <Select placeholder="授权角色(支持多选)" style={{ width: 350 }} mode="multiple" allowClear>
              {[
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
              ].map((item) => (
                <Select.Option key={item.value} value={item.value} label={<RoleTag roleId={item.value} />}>
                  <RoleTag roleId={item.value} />
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
              <Button onClick={showAddOrEditModal}>新增</Button>
              <Modal
                title={type.current === 'add' ? '新增' : '编辑'}
                open={addOrEditModalShow}
                onOk={handleAddOrEdit}
                onCancel={handleAddOrEditCancel}
                afterClose={handleClosed}
                forceRender={true}
              >
                <Form
                  name="add-or-edit-form"
                  form={addOrEditForm}
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 20 }}
                  autoComplete="off"
                  initialValues={{ level: 1, roleIds: ['0'], is_valid: true }}
                  onFinish={handleAddOrEditFinish}
                >
                  <Form.Item name="id" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="菜单名称"
                    name="name"
                    rules={[
                      { required: true, message: '请输入菜单名称!' },
                      {
                        type: 'string',
                        min: 2,
                        max: 16,
                        message: '名字符长度需在2-16位之间'
                      }
                    ]}
                  >
                    <Input ref={nameInputRef} />
                  </Form.Item>
                  <Form.Item label="图标" name="icon">
                    <Select placeholder="请选择图标(可搜索)" optionLabelProp="label" showSearch>
                      {iconList.map((item) => (
                        <Select.Option
                          key={item.value}
                          value={item.value}
                          label={
                            <>
                              <IconFont type={item.value} /> {item.value}
                            </>
                          }
                        >
                          <IconFont type={item.value} /> {item.value}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    // label="路由地址"
                    label={
                      <>
                        <span className="mr4">
                          <Tooltip
                            destroyTooltipOnHide
                            title={`/index 和 index 含义相同，都表示 ${window.location.host}/index`}
                            color="orange"
                            placement="top"
                          >
                            <InfoCircleOutlined className="ml5" style={{ color: 'orange' }} />
                          </Tooltip>
                        </span>
                        路由地址
                      </>
                    }
                    name="path"
                    rules={[{ required: true, message: '请输入路由路径!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    // label="组件路径"
                    label={
                      <>
                        <span className="mr4">
                          <Tooltip title=" @/ 和 ./ 含义相同, 都表示 src/ 目录" color="orange" placement="top">
                            <InfoCircleOutlined className="ml5" style={{ color: 'orange' }} />
                          </Tooltip>
                        </span>
                        组件路径
                      </>
                    }
                    name="component"
                    rules={[
                      { required: true, message: '请输入组件路径!' },
                      {
                        pattern: /^(@|\.)\/.*$/,
                        message: '请检查组件路径格式，确保以 @/ 或 ./ 开头!'
                      }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item label="排序级别" name="level">
                    <InputNumber min={1} style={{ width: '30%' }} precision={0} />
                  </Form.Item>
                  <Form.Item label="授权角色" name="roleIds">
                    <Select
                      mode="multiple"
                      placeholder="请选择角色"
                      options={[
                        {
                          value: '0',
                          label: '超级管理员',
                          disabled: true
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
                  <Form.Item label="菜单状态" name="isValid" valuePropName="checked">
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                  </Form.Item>
                  {/* 按钮仅用于触发表单的回车提交事件，可用 hidden 属性隐藏 */}
                  <button type="submit" hidden></button>
                </Form>
              </Modal>
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
          onChange: onPagination
        }}
      />
    </div>
  )
}
