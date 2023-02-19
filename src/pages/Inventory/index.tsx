import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, Image, Input, InputRef, message, Modal, Select, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import QuantityControl from './components/QuantityControl'
import { deleteInventoryAPI, addOrEditInventoryAPI, getInventoryListAPI, IInventory } from './service'

type SearchParams = {
  queryString?: string
  status?: number
}

const initialPageQuery = {
  pageNum: 1,
  pageSize: 10,
  params: {}
}

// 商品状态枚举
enum ItemStatusEnum {
  已下架,
  已上架,
  已售完
}

// 商品状态对应颜色枚举
enum ItemStatusColorEnum {
  red,
  green,
  gray
}

export default function Inventory() {
  const [inventoryList, setInventoryList] = useState<IInventory[]>([])
  const [total, setTotal] = useState(0)
  const [searchForm] = Form.useForm()

  const [pageQuery, setPageQuery] = useState<IPageQuery<SearchParams>>(initialPageQuery)

  // 获取库存列表
  const getInventoryList = async () => {
    const { data, total } = await getInventoryListAPI<SearchParams>(pageQuery)
    setInventoryList(data || [])
    setTotal(total || 0)
  }

  useEffect(() => {
    getInventoryList()
  }, [pageQuery])

  // 设置查询参数
  const handleSearch = (values: SearchParams) => {
    setPageQuery({
      ...pageQuery,
      params: {
        queryString: values.queryString,
        status: values.status
      }
    })
  }

  // 重置查询参数
  const handleReset = () => {
    searchForm.resetFields()
    setPageQuery(initialPageQuery)
  }

  // 删除库存
  const onDeleteInventory = (id: number) => {
    Modal.confirm({
      title: '删除提示',
      icon: <ExclamationCircleOutlined />,
      content: '您确认删除该库存吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteInventoryAPI(id)
          message[res.code === 200 ? 'success' : 'error'](res.message)
          getInventoryList()
        } catch (err: any) {
          message.error(err.data.message || '删除失败！')
        }
      }
    })
  }

  const type = useRef('add')
  const itemNameInputRef = useRef<InputRef>(null)
  const [addOrEditForm] = Form.useForm<IInventory>()
  const [isAddOrEditModalOpen, setIsAddOrEditModalOpen] = useState(false)

  // 打开新增或编辑库存模态框
  const showAddOrEditModal = (row?: IInventory) => {
    type.current = 'add'
    if (row?.id) {
      type.current = 'edit'
      addOrEditForm.setFieldsValue(row)
    }
    setIsAddOrEditModalOpen(() => {
      // 打开模态框输入框自动获得焦点
      setTimeout(() => {
        itemNameInputRef.current?.focus({
          cursor: 'end'
        })
      }, 0)
      return true
    })
  }

  // 提交新增或编辑表单
  const handleAddOrEditFinish = async (inventoryInfo: IInventory) => {
    const res = await addOrEditInventoryAPI(inventoryInfo)
    if (res.code === 200) {
      message.success(res.message, 2)
      addOrEditForm.resetFields()
      setIsAddOrEditModalOpen(false)
      getInventoryList()
    } else {
      message.error(res.message)
    }
  }

  // 新增或编辑库存信息
  const handleAddOrEdit = async () => {
    // 校验表单
    const inventoryInfo = await addOrEditForm.validateFields()
    handleAddOrEditFinish(inventoryInfo)
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

  // 修改库存状态
  const onChangeValid = (checked: boolean, row: IInventory) => {
    // row.isValid = checked
    addOrEditForm.setFieldsValue(row)
    handleAddOrEdit()
  }

  // 表格列配置
  const columns: ColumnsType<IInventory> = [
    {
      title: '商品编号',
      dataIndex: 'itemNumber',
      align: 'center'
    },
    {
      title: '图片',
      dataIndex: 'imgUrl',
      align: 'center',
      render: (imgUrl) => (
        <Image
          width={100}
          src={imgUrl || 'error'}
          fallback="data:image/png;base64,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"
        />
      )
    },
    {
      title: '商品名称',
      dataIndex: 'itemName',
      render: (itemName, row) => (
        <Button type="link" key={row.id} onClick={() => showAddOrEditModal(row)}>
          {itemName}
        </Button>
      ),
      align: 'center'
    },
    {
      title: '库存数量',
      dataIndex: 'quantity',
      render: (quantity, row) => (
        <Space>
          <QuantityControl type="reduce" onChange={handleAddOrEditFinish} row={row} />
          <span style={{ display: 'inline-block', minWidth: '50px' }}>{quantity}</span>
          <QuantityControl type="add" onChange={handleAddOrEditFinish} row={row} />
        </Space>
      ),
      align: 'center'
    },
    {
      title: '计量单位',
      dataIndex: 'unit',
      align: 'center'
    },
    {
      title: '成本价(元)',
      dataIndex: 'costPrice',
      align: 'center'
    },
    {
      title: '销售价(元)',
      dataIndex: 'sellingPrice',
      align: 'center'
    },
    {
      title: '存放位置',
      dataIndex: 'location',
      align: 'center'
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdated',
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (type) => <Tag color={ItemStatusColorEnum[type]}>{ItemStatusEnum[type]}</Tag>,
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
          <Button danger type="primary" onClick={() => onDeleteInventory(row.id!)}>
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
            <Input placeholder="商品编号/商品名称/存放位置" style={{ width: 280 }} prefix={<SearchOutlined />} />
          </Form.Item>
          <Form.Item name="status">
            <Select
              placeholder="状态"
              style={{ width: 120 }}
              allowClear
              options={[
                {
                  value: 0,
                  label: '已下架'
                },
                {
                  value: 1,
                  label: '已上架'
                },
                {
                  value: 2,
                  label: '已售空'
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
                  <Form.Item label="商品编号" name="itemNumber" hidden={type.current === 'add'}>
                    <Input disabled />
                  </Form.Item>
                  <Form.Item label="商品名称" name="itemName" rules={[{ required: true, message: '请输入商品名称!' }]}>
                    <Input ref={itemNameInputRef} />
                  </Form.Item>
                  <Form.Item label="库存数量" name="quantity">
                    <Input />
                  </Form.Item>
                  <Form.Item label="计量单位" name="unit">
                    <Input />
                  </Form.Item>
                  <Form.Item label="成本价" name="costPrice">
                    <Input />
                  </Form.Item>
                  <Form.Item label="销售价" name="sellingPrice">
                    <Input />
                  </Form.Item>
                  <Form.Item label="存放位置" name="location">
                    <Input />
                  </Form.Item>
                  <Form.Item label="状态" name="status">
                    <Select
                      style={{ width: 120 }}
                      allowClear
                      options={[
                        {
                          value: 0,
                          label: '已下架'
                        },
                        {
                          value: 1,
                          label: '已上架'
                        },
                        {
                          value: 2,
                          label: '已售完'
                        }
                      ]}
                    />
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
        dataSource={inventoryList}
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
