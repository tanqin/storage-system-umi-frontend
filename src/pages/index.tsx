import styles from './index.less'
import { useSelector } from 'umi'
import { Card, Col, Row } from 'antd'
import RoleTag from '@/components/RoleTag'

export default function Home() {
  const {
    userInfo: { roleId, username, nickname }
  } = useSelector((state: any) => state.user)

  return (
    <div className={styles.home}>
      <h2 className="user-info">
        <RoleTag roleId={roleId} />
        <span>账号：{username}</span> &emsp;
        <span>昵称：{nickname}</span>
      </h2>
      <div>
        <Row gutter={16}>
          <Col span={12}>
            <Card title="各商品增减对比">
              <p>各商品增减对比</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="各商品收支对比">
              <p>各商品收支对比</p>
            </Card>
          </Col>
        </Row>

        <Card title="系统说明" style={{ width: '100%' }}>
          <section>
            <strong>职务:</strong>
            <p>
              &emsp;
              <RoleTag roleId={0} />和 <RoleTag roleId={1} />
              负责对商品分类、补充货源、补货通知；
            </p>
            <p>
              &emsp;
              <RoleTag /> 负责取走商品、提醒补货。
            </p>
          </section>
          <section>
            <strong>权限：</strong>
            <p>
              &emsp;
              <RoleTag roleId={0} />
              对其余账号拥有修改密码、停用账号、角色分配、查看操作日志、系统路由配置等权限；
            </p>
            <p>
              &emsp;
              <RoleTag roleId={1} />
              对普通用户账号拥有修改密码、停用账号、查看操作日志等权限；
            </p>
            <p>
              &emsp;
              <RoleTag />
              对个人账号拥有修改密码、查看操作记录等权限；
            </p>
          </section>
        </Card>
      </div>
    </div>
  )
}
