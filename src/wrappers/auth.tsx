import { PropsType } from '@/pages/User/Login'
import { getToken } from '@/utils/auth'
import { Redirect } from 'umi'

export default (props: PropsType) => {
  if (getToken()) {
    return <div>{props.children}</div>
  } else {
    return <Redirect to="/user/login" />
  }
}
