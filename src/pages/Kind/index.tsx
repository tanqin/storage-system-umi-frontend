import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputRef, message, Modal, Space, Switch, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { deleteKindAPI, addOrEditKindAPI, getKindListAPI, IKind } from './service'

type SearchParams = {
  queryString?: string
}

const initialPageQuery = {
  pageNum: 1,
  pageSize: 10,
  params: {}
}

export default function Kind() {
  const [kindList, setKindList] = useState<IKind[]>([])
  const [total, setTotal] = useState(0)
  const [searchForm] = Form.useForm()

  const [pageQuery, setPageQuery] = useState<IPageQuery<SearchParams>>(initialPageQuery)

  // 获取种类列表
  const getKindList = async () => {
    const { data, total } = await getKindListAPI<SearchParams>(pageQuery)
    setKindList(data || [])
    setTotal(total || 0)
  }

  useEffect(() => {
    getKindList()
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

  // 删除种类
  const onDeleteKind = (id: number) => {
    Modal.confirm({
      title: '删除提示',
      icon: <ExclamationCircleOutlined />,
      content: '您确认删除该种类吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await deleteKindAPI(id)
        message[res.code === 200 ? 'success' : 'error'](res.message)
        getKindList()
      }
    })
  }

  const type = useRef('add')
  const nameInputRef = useRef<InputRef>(null)
  const [addOrEditForm] = Form.useForm<IKind>()
  const [isAddOrEditModalOpen, setIsAddOrEditModalOpen] = useState(false)

  // 新增或编辑种类模态框
  const showAddOrEditModal = (row?: IKind) => {
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
  const handleAddOrEditFinish = async (kindInfo: IKind) => {
    const res = await addOrEditKindAPI(kindInfo)
    if (res.code === 200) {
      message.success(res.message, 2)
      addOrEditForm.resetFields()
      setIsAddOrEditModalOpen(false)
      getKindList()
    } else {
      message.error(res.message)
    }
  }

  // 新增或编辑种类信息
  const handleAddOrEdit = async () => {
    // 校验表单
    const kindInfo = await addOrEditForm.validateFields()
    handleAddOrEditFinish(kindInfo)
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

  // 修改种类状态
  const onChangeValid = (checked: boolean, row: IKind) => {
    row.isValid = checked
    addOrEditForm.setFieldsValue(row)
    handleAddOrEdit()
  }

  // 表格列配置
  const columns: ColumnsType<IKind> = [
    {
      title: '种类编号',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: '种类名称',
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
      title: '所属仓库',
      dataIndex: 'storageId',
      align: 'center'
    },
    {
      title: '种类状态',
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
          <Button danger type="primary" onClick={() => onDeleteKind(row.id!)}>
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
            <Input placeholder="种类名称/备注" style={{ width: 180 }} prefix={<SearchOutlined />} />
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
                  <Form.Item label="种类名称" name="name" rules={[{ required: true, message: '请输入种类名称!' }]}>
                    <Input ref={nameInputRef} />
                  </Form.Item>
                  <Form.Item label="备注" name="remark">
                    <Input.TextArea showCount maxLength={128} style={{ height: 120, resize: 'none' }} />
                  </Form.Item>
                  <Form.Item label="种类状态" name="isValid" valuePropName="checked">
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
        dataSource={kindList}
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
