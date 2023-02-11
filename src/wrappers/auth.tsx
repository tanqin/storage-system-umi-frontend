import { getToken } from '@/utils/auth'
import { IRouteComponentProps, Redirect } from 'umi'

export default (props: IRouteComponentProps) => {
  if (getToken()) {
    return <div>{props.children}</div>
  } else {
    return <Redirect to="/user/login" />
  }
}
