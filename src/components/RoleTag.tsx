import { Tag } from 'antd'
import { IRouteComponentProps } from 'umi'

interface PropType {
  roleId?: number
}

export default function RoleTag({ roleId = 2 }: PropType) {
  return (
    <Tag color={roleId === 2 ? 'gray' : roleId === 1 ? 'red' : 'gold'}>
      {roleId === 2 ? '普通用户' : roleId === 1 ? '管理员' : '超级管理员'}
    </Tag>
  )
}
