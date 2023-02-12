import styles from './index.less'
import { useSelector } from 'dva'
export default function Home() {
  // const dispatch = useDispatch() // dispatch 函数用来发送命令，调用 reducers
  const userInfo = useSelector((state: any) => state)
  console.log(userInfo)

  return (
    <div>
      <h2>首页</h2>
    </div>
  )
}
