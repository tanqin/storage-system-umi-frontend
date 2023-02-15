import { Tag } from 'antd'

interface PropType {
  roleId?: number | string
}

export default function RoleTag({ roleId = 2 }: PropType) {
  if (typeof roleId === 'string') {
    roleId = parseInt(roleId)
  }
  return (
    <Tag color={roleId === 2 ? 'gray' : roleId === 1 ? 'red' : 'gold'}>
      {roleId === 2 ? '普通用户' : roleId === 1 ? '管理员' : '超级管理员'}
    </Tag>
  )
}
