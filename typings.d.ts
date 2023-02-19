declare module '*.css'
declare module '*.less'
declare module '*.png'
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement
  const url: string
  export default url
}

declare interface IPageQuery<T = {}> {
  pageNum?: number
  pageSize?: number
  params?: T
}

declare type SelectType = {
  value: number
  label: string
}
