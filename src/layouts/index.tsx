import { IRouteComponentProps } from 'umi'

export default function (props: IRouteComponentProps) {
  console.log(props.location.pathname)
  if (props.location.pathname === '/login') {
    return <>{props.children}</>
  }

  return <>{props.children}</>
}
