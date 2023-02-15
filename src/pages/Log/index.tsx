import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, Image, Input, InputRef, message, Modal, Space, Switch, Table, Tag, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { deleteLogAPI, getLogListAPI, ILog } from './service'

type SearchParams = {
  queryString?: string
}

const initialPageQuery = {
  pageNum: 1,
  pageSize: 10,
  params: {}
}

enum TypeEnum {
  出库,
  入库
}
enum TypeColorEnum {
  red,
  green
}

export default function Log() {
  const [logList, setLogList] = useState<ILog[]>([])
  const [total, setTotal] = useState(0)
  const [searchForm] = Form.useForm()

  const [pageQuery, setPageQuery] = useState<IPageQuery<SearchParams>>(initialPageQuery)

  // 获取日志列表
  const getLogList = async () => {
    const { data, total } = await getLogListAPI<SearchParams>(pageQuery)
    setLogList(data || [])
    setTotal(total || 0)
  }

  useEffect(() => {
    getLogList()
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

  // 删除日志
  const onDeleteLog = (id: number) => {
    Modal.confirm({
      title: '删除提示',
      icon: <ExclamationCircleOutlined />,
      content: '您确认删除该日志吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await deleteLogAPI(id)
        message[res.code === 200 ? 'success' : 'error'](res.message)
        getLogList()
      }
    })
  }

  // 分页
  const onPagination = (pageNum: number, pageSize: number) => {
    setPageQuery({
      ...pageQuery,
      pageNum,
      pageSize
    })
  }

  // 表格列配置
  const columns: ColumnsType<ILog> = [
    {
      title: '编号',
      dataIndex: 'id',
      align: 'center',
      width: 80
    },
    {
      title: '物品名称',
      dataIndex: 'goodsId',
      align: 'center'
    },
    {
      title: '操作人',
      dataIndex: 'operatorId',
      align: 'center'
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      render: (type) => <Tag color={TypeColorEnum[type]}>{TypeEnum[type]}</Tag>,
      align: 'center'
    },
    {
      title: '数量',
      dataIndex: 'count',
      width: 120,
      render: (count) => <span style={{ color: '#008cff', fontWeight: 'bold' }}>{count}</span>,
      align: 'center'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center'
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, row) => (
        <Button danger type="primary" onClick={() => onDeleteLog(row.id!)}>
          删除
        </Button>
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
            <Input placeholder="备注" style={{ width: 180 }} prefix={<SearchOutlined />} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={logList}
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
