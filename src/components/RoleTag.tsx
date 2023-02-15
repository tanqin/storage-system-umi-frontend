import { Tag } from 'antd'

interface PropType {
  roleId?: number | string
}

// 角色枚举
enum RoleEnum {
  超级管理员,
  管理员,
  普通用户
}

// 角色对应颜色枚举
enum RoleColorEnum {
  gold,
  red,
  gray
}

export default function RoleTag({ roleId = 2 }: PropType) {
  if (typeof roleId === 'string') {
    roleId = parseInt(roleId)
  }
  return <Tag color={RoleColorEnum[roleId]}>{RoleEnum[roleId]}</Tag>
}
