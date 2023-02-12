import styles from './index.less'
import { useDispatch, useSelector } from 'dva'
import { useEffect } from 'react'
import { Tag } from 'antd'
export default function Home() {
  const dispatch = useDispatch()
  const {
    userInfo: { roleId, username, nickname }
  } = useSelector((state: any) => state.user)

  useEffect(() => {
    dispatch({ type: 'user/getUserInfo' })
  }, [])

  return (
    <div className={styles.home}>
      <h2 className="user-info">
        <Tag color={roleId === 2 ? 'gray' : roleId === 1 ? 'red' : 'gold'}>
          {roleId === 2 ? '普通用户' : roleId === 1 ? '管理员' : '超级管理员'}
        </Tag>
        <span>账号：{username}</span> &emsp;
        <span>昵称：{nickname}</span>
      </h2>
    </div>
  )
}
