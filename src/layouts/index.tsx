import { IRouteComponentProps, useModel } from 'umi'
import { useSelector } from 'dva'
import { useEffect } from 'react'

export default function Layout({ children }: IRouteComponentProps) {
  const { setInitialState } = useModel('@@initialState')
  const { userInfo } = useSelector((state: any) => state.user)

  useEffect(() => {
    setInitialState({
      name: userInfo.username,
      avatar: 'https://img1.imgtp.com/2023/02/12/eBoM5d3A.png'
    })
  }, [userInfo])

  return children
}
