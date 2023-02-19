import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, Popconfirm, Tooltip } from 'antd'
import { IInventory } from '../service'

type PropType = {
  type: 'add' | 'reduce'
  row: IInventory
  onChange: Function
}

enum TextType {
  add = '增加',
  reduce = '减少'
}

export default function QuantityControl({ type, row, onChange }: PropType) {
  const [form] = Form.useForm()

  const handleConfirm = () => {
    if (type === 'add') {
      console.log(form.getFieldValue('changeQuantity'))

      row.quantity += form.getFieldValue('changeQuantity')
      console.log(row.quantity)
    } else {
      row.quantity -= form.getFieldValue('changeQuantity')
    }
    onChange(row)
  }

  const handleOpenChange = () => {
    form.resetFields()
  }

  return (
    <Tooltip title={`${TextType[type]}库存`}>
      <Popconfirm
        placement="bottom"
        icon=""
        title={
          <>
            <h3>
              {TextType[type]} (当前库存：{row.quantity})
            </h3>
            <Form onFinish={handleConfirm} form={form}>
              <Form.Item name="changeQuantity" rules={[{ required: true, message: '该项必填!' }]}>
                <InputNumber autoFocus style={{ width: '100%' }} min={0} max={type === 'add' ? 9999 : row.quantity} />
              </Form.Item>
              <button type="submit" hidden />
            </Form>
          </>
        }
        onConfirm={handleConfirm}
        onOpenChange={handleOpenChange}
      >
        <Button
          disabled={type === 'reduce' && !row.quantity}
          type="primary"
          shape="circle"
          icon={type === 'add' ? <PlusOutlined /> : <MinusOutlined />}
          size="small"
        />
      </Popconfirm>
    </Tooltip>
  )
}
