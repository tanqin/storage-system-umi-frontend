import {
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  MinusOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  InputRef,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
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

  // 修改库存数量
  const handleChangeQuantity = (type: 'add' | 'reduce') => {
    console.log(type)
  }

  // 表格列配置
  const columns: ColumnsType<IInventory> = [
    {
      title: '商品编号',
      dataIndex: 'itemNumber',
      align: 'center'
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
          <Tooltip title="减少库存">
            <Popconfirm
              placement="top"
              icon=""
              title={
                <>
                  <h3>减少 (当前库存：{quantity})</h3> <Input />
                </>
              }
              onConfirm={() => handleChangeQuantity('reduce')}
            >
              <Button type="primary" shape="circle" icon={<MinusOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
          <span>{quantity}</span>
          <Tooltip title="增加库存">
            <Popconfirm
              placement="top"
              icon=""
              title={
                <>
                  <h3>增加 (当前库存：{quantity})</h3> <Input />
                </>
              }
              onConfirm={() => handleChangeQuantity('add')}
            >
              <Button type="primary" shape="circle" icon={<PlusOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
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
      title: '成本价',
      dataIndex: 'costPrice',
      align: 'center'
    },
    {
      title: '销售价',
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
