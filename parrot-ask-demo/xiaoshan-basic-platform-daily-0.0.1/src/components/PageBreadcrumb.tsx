import React from "react";
import useApp from "src/hook/useApp";
import { Breadcrumb, Button, Row, Space } from "antd";
import { useGlobalState } from "src/store";
import { HomeOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
interface PageBreadcrumbProps {
  id: number;
}
export default function PageBreadcrumb(props: PageBreadcrumbProps) {
  const { getMenuPath } = useApp();
  const [state] = useGlobalState();
  const history = useHistory();
  const path = getMenuPath(props.id).slice(2);

  const showBack = !/^\/app\/\d+\/\d+$/.test(history.location.pathname);

  return (
    <Row
      justify="space-between"
      align="middle"
      style={{
        padding: 10,
        background: "#fff",
        borderBottom: "1px solid #DFE1E6",
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
      }}
    >
      <Breadcrumb>
        {path.map((m, i) => (
          <Breadcrumb.Item>
            {i === 0 && <HomeOutlined />}
            <span>{m.zhName}</span>
          </Breadcrumb.Item>
        ))}
        {state.breadcrumb.map((b) => (
          <Breadcrumb.Item>{b.zhName}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
      {showBack && (
        <Button
          type="link"
          style={{ float: "right", height: 20, lineHeight: "20px", padding: 0 }}
          onClick={history.goBack}
        >
          返回
        </Button>
      )}
    </Row>
  );
}
