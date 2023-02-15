import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputRef, message, Modal, Space, Switch, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { deleteStorageAPI, addOrEditStorageAPI, getStorageListAPI, IStorage } from './service'

type SearchParams = {
  queryString?: string
}

const initialPageQuery = {
  pageNum: 1,
  pageSize: 10,
  params: {}
}

export default function Storage() {
  const [storageList, setStorageList] = useState<IStorage[]>([])
  const [total, setTotal] = useState(0)
  const [searchForm] = Form.useForm()

  const [pageQuery, setPageQuery] = useState<IPageQuery<SearchParams>>(initialPageQuery)

  // 获取仓库列表
  const getStorageList = async () => {
    const { data, total } = await getStorageListAPI<SearchParams>(pageQuery)
    setStorageList(data || [])
    setTotal(total || 0)
  }

  useEffect(() => {
    getStorageList()
  }, [pageQuery])

  // 设置查询参数
  const handleSearch = (values: SearchParams) => {
    setPageQuery({
      ...pageQuery,
      params: {
        queryString: values.queryString
      }
    })
  }

  // 重置查询参数
  const handleReset = () => {
    searchForm.resetFields()
    setPageQuery(initialPageQuery)
  }

  // 删除仓库
  const onDeleteStorage = (id: number) => {
    Modal.confirm({
      title: '删除提示',
      icon: <ExclamationCircleOutlined />,
      content: '您确认删除该仓库吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await deleteStorageAPI(id)
        message[res.code === 200 ? 'success' : 'error'](res.message)
        getStorageList()
      }
    })
  }

  const type = useRef('add')
  const nameInputRef = useRef<InputRef>(null)
  const [addOrEditForm] = Form.useForm<IStorage>()
  const [isAddOrEditModalOpen, setIsAddOrEditModalOpen] = useState(false)

  // 打开新增或编辑仓库模态框
  const showAddOrEditModal = (row?: IStorage) => {
    type.current = 'add'
    if (row?.id) {
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
  const handleAddOrEditFinish = async (storageInfo: IStorage) => {
    const res = await addOrEditStorageAPI(storageInfo)
    if (res.code === 200) {
      message.success(res.message, 2)
      addOrEditForm.resetFields()
      setIsAddOrEditModalOpen(false)
      getStorageList()
    } else {
      message.error(res.message)
    }
  }

  // 新增或编辑仓库信息
  const handleAddOrEdit = async () => {
    // 校验表单
    const storageInfo = await addOrEditForm.validateFields()
    handleAddOrEditFinish(storageInfo)
  }

  // 取消添加或编辑
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

  // 修改仓库状态
  const onChangeValid = (checked: boolean, row: IStorage) => {
    row.isValid = checked
    addOrEditForm.setFieldsValue(row)
    handleAddOrEdit()
  }

  // 表格列配置
  const columns: ColumnsType<IStorage> = [
    {
      title: '仓库编号',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: '仓库名称',
      dataIndex: 'name',
      render: (name, row) => (
        <Button type="link" key={row.id} onClick={() => showAddOrEditModal(row)}>
          {name}
        </Button>
      ),
      align: 'center'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center'
    },
    {
      title: '包含种类(单位: 种)',
      dataIndex: 'kindCount',
      align: 'center'
    },
    {
      title: '包含物品(单位: 件)',
      dataIndex: 'goodsCount',
      align: 'center'
    },
    {
      title: '仓库状态',
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
        <Space>
          <Button type="primary" onClick={() => showAddOrEditModal(row)}>
            编辑
          </Button>
          <Button danger type="primary" onClick={() => onDeleteStorage(row.id!)}>
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
            <Input placeholder="仓库名称/备注" style={{ width: 180 }} prefix={<SearchOutlined />} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
              <Button onClick={() => showAddOrEditModal()}>新增</Button>
              <Modal
                title={type.current === 'add' ? '新增' : '编辑'}
                open={isAddOrEditModalOpen}
                onOk={() => handleAddOrEdit()}
                onCancel={handleAddOrEditCancel}
                afterClose={handleClosed}
                forceRender={true}
              >
                <Form
                  name="add-or-edit-form"
                  form={addOrEditForm}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  autoComplete="off"
                  initialValues={{ isValid: true }}
                  onFinish={handleAddOrEditFinish}
                >
                  <Form.Item name="id" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item label="仓库名称" name="name" rules={[{ required: true, message: '请输入仓库名称!' }]}>
                    <Input ref={nameInputRef} />
                  </Form.Item>
                  <Form.Item label="备注" name="remark">
                    <Input.TextArea showCount maxLength={128} style={{ height: 120, resize: 'none' }} />
                  </Form.Item>
                  <Form.Item label="仓库状态" name="isValid" valuePropName="checked">
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
      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={storageList}
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
